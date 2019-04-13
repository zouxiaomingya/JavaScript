### 写在前面

> 用最基础的方法讲解 Redux 实现原理？说白了其实是我能力有限，只能用最基础的方法来讲解，为了讲的更加清楚，文章可能比较拖沓。不过我相信，不是很了解 Redux 的同学，看完我今天分享的文章一定会有所收获！

### 什么是 Redux ?
> 这不是我今天要说的重点，想知道什么是 Redux [点击传送门](https://www.redux.org.cn/docs/introduction/Motivation.html)

### 开始

> 在开始之前我想先讲一种常用的设计模式：观察者模式。先来说一下我对`观察者模式`的个人理解：观察者模式（Publish/Subscribe）模式。对于这种模式很清楚的同学下面这段代码可以跳过。如果你还不清楚，你可以试着手敲一遍下面的代码！！

### 观察者模式

观察者模式，基于一个主题/事件通道，希望接收通知的对象（称为subscriber）通过自定义事件订
阅主题，通过deliver发布主题事件的方式被通知。就和用户订阅微信公众号道理一样，只要发布，用户就能接收到最新的内容。

```javaScript
/**
 * describe: 实现一个观察者模式
 */
let data = {
    hero: '凤凰',
};
//用来储存 订阅者 的数组
let subscribers = [];
//订阅 添加订阅者 方法
const addSubscriber = function(fn) {
    subscribers.push(fn)
}
//发布
const deliver = function(name) {
    data.hero = name;
    //当数据发生改变，调用（通知）所有方法（订阅者）
    for(let i = 0; i<subscribers.length; i++){
        const fn = subscribers[i]
        fn()
    }
}
//通过 addSubscriber 发起订阅
addSubscriber(() => {
    console.log(data.hero)
})
//改变data，就会自动打印名称
deliver('发条') 
deliver('狐狸')
deliver('卡牌')
```
这个发布订阅通过 addSubscriber 来储存订阅者（方法fn），当通过调用 deliver 来改变数据的时候，就会自动遍历 addSubscriber 来执行里面的 fn 方法 。

> 为啥要讲这个发布订阅模式呢？因为搞清楚了这个模式那么接下来你读该文章就会感觉更加清晰。

### Redux 起步

`首先我们把上面那个发布订阅代码优化一下，顺便改一下命名，为什么要改命名？主要是紧跟 Redux 的步伐。让同学们更加眼熟。`

```javaScript
let state = {hero: '凤凰'};
let subscribers = [];
//订阅 定义一个 subscribe 
const subscribe = (fn) => {
    subscribers.push(fn)
}
//发布
const dispatch = (name) => {
    state.hero = name;
    //当数据发生改变，调用（通知）所有方法（订阅者）
    subscribers.forEach(fn=>fn())
}
//通过 subscribe 发起订阅
subscribe(() => {
    console.log(state.hero)
})
//改变state状态，就会自动打印名称
//这里要注意的是，state状态不能直接去修改
dispatch('发条') 
dispatch('狐狸')
dispatch('卡牌')
```

现在这样一改是不是很眼熟了，没错这就是一个类似redux改变状态的思路。但是光一个发布订阅还是不够的，不可能改变一个状态需要去定义这么多方法。所以我们把他封装起来。

### creatStore 方法

```javaScript
const creatStore = (initState) => {
    let state = initState;
    let subscribers = [];
    //订阅 定义一个 subscribe 
    const subscribe = (fn) => {
        subscribers.push(fn)
    }
    //发布
    const dispatch = (currentState) => {
        state = currentState;
        //当数据发生改变，调用（通知）所有方法（订阅者）
        subscribers.forEach(fn=>fn())
    }
    // 这里需要添加这个获取 state 的方法
    const getState = () => {
        return state;
    }
    return {
        subscribe,
        dispatch,
        getState,
    }
}
```
这样就创建好了一个 createStore 方法。没有什么新东西，就传进去一个初始状态，然后在返回 subscribe, dispatch, getState 三大方法。这里新增了个 getState 方法，代码很简单就是一个 return state 为了获取 state.

### creatStore 使用

> 实现了 createStore 下面我们来试试如何使用他，那就拿那个非常经典的案例--计数器来试试

```javaScript
let initState = {
    num: 0,
}
const store = creatStore(initState);
//订阅
store.subscribe(() => {
    let state = store.getState()
    console.log(state.num)
})
// +1
store.dispatch({
   num: store.getState().num + 1
})
//-1
store.dispatch({
   num: store.getState().num - 1
})
```
这个样子又接近了一点 Redux 的模样。 不过这样有个问题。如果你使用 store.dispatch 方法时，中间万一写错了或者传了个其他东西那就比较麻烦了。就比如下面这样：


![](https://user-gold-cdn.xitu.io/2019/3/1/16939c3539c0c72c?w=787&h=365&f=png&s=27227)

其实我是想 +1，+1，-1 最后应该是 1 (初始 num 为0)！但是由于写错了一个导致后面的都会错。而且他还有个问题就是可以随便的给一个新的状态。那么就显得不那么单纯了。比如下面这样：

![](https://user-gold-cdn.xitu.io/2019/3/1/16939c5e46c12d5f?w=891&h=481&f=png&s=28558)

因为恶意修改 num 为 String 类型，导致后面在使用 dispatch 由于 num 不再是 Number 类型，导致打印出 NaN，这就不是我们想要的啦。所以我们要在改造一下，让 dispatch 变得单纯一些。那要怎么做呢？我们请一个管理者来帮我们管理，暂且给他命名 reducer

### 为什么叫 reducer
我在 reducer 官网中找到下面这段介绍 reducer

![](https://user-gold-cdn.xitu.io/2019/3/2/1693c58d7bdc7822?w=827&h=155&f=png&s=22679)
什么意思，对于这种英语上来我就是有道翻译一下


![](https://user-gold-cdn.xitu.io/2019/3/2/1693c5c94a3f0305?w=626&h=187&f=png&s=15473)

当然这个翻译感觉并没什么作用，

找一找中文 Redux 官网，他是这样说的：
> 之所以将这样的函数称之为reducer，是因为这种函数与被传入 Array.prototype.reduce(reducer, ?initialValue) 里的回调函数属于相同的类型。保持 reducer 纯净非常重要。永远不要在 reducer 里做这些操作。

诶，这个翻译似乎就清楚了很多。正如下面评论者说的一样 灵感来自于数组中reduce方法，是一种运算合成。那么说到这里我就来介绍一下 reduce。

### 什么是 reduce
话不多说直接上代码
```javascript
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15

/*该减速作用有四个参数：
*累加器（acc）
*当前价值（cur）
*当前指数（idx）
*源数组（src）
*您的reducer函数的返回值被分配给累加器，其值在整个阵列的每次迭代中被记住，并最终成为最终的单个结果值。
*/
```
具体参数介绍
```javascript
callback
  函数在数组中的每个元素上执行，有四个参数：
accumulator
  累加器累加回调的返回值; 它是先前在回调调用中返回的累计值，或者initialValue，如果提供（参见下文）。
currentValue
  当前元素在数组中处理。
currentIndex可选的
  数组中正在处理的当前元素的索引。如果initialValue提供了an，则从索引0开始，否则从索引1开始
array可选的
  该阵列reduce()被召唤。
initialValue可选的
  用作第一次调用的第一个参数的值callback。如果未提供初始值，则将使用数组中的第一个元素。调用reduce()没有初始值的空数组是一个错误。
```
这个方法相对比 forEach, map, filter 这个理解起来还是算比较困难的。也可以看 MDN 的 [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 详细介绍

>注：首先感谢下面评论者 panda080 的指导，受他的建议，我重新去 Rudex 官网寻找。通过学习自己也更加的理解了 reducer 和 reduce [reducer官网](https://redux.js.org/basics/reducers)

 `ps:理解完之后，其实个人觉得 reducer 这个命名从翻译过来的角度总觉得很怪异。可能英语有限，或许他有更加贴切的意思我还不知道。`

### 什么是 reducer

reducer 在我学习的过程中我把他认为是个管理者(可能这个认为是不正确的)，然后我们每次想做什么就去通知管理者，让他在来根据我们说的去做。如果我们不小心说错了，那么他就不会去做。直接按默认的事情来。噔噔蹬蹬 reducer 登场！！

``` javascript
function reducer(state, action) {
    //通过传进来的 action.type 让管理者去匹配要做的事情
    switch (action.type){
        case 'add':
            return {
                ...state,
                count: state.count + 1
            }
        case 'minus':
            return {
                ...state,
                count: state.count - 1
            }
        // 没有匹配到的方法 就返回默认的值
        default:
            return state;
    }
}
```
增加了这个管理者，那么我们就要重新来写一下之前的 createStroe 方法了：把 reducer 放进去

```javascript
const creatStore = (reducer,initState) => {
    let state = initState;
    let subscribers = [];
    //订阅 定义一个 subscribe 
    const subscribe = (fn) => {
        subscribers.push(fn)
    }
    //发布
    const dispatch = (action) => {
        state = reducer(state,action);
        subscribers.forEach(fn=>fn())
    }
    const getState = () => {
        return state;
    }
    return {
        subscribe,
        dispatch,
        getState,
    }
}
```
很简单的一个修改，为了让你们方便看出修改的地方，和区别，我特意重新码了这两个前后的方法对比，如下图

![](https://user-gold-cdn.xitu.io/2019/3/1/16939e4d2dd56c32?w=1236&h=503&f=png&s=96274)



 好，接下来我们试试添加了管理者的 creatStore 效果如何。

```javascript
function reducer(state, action) {
    //通过传进来的 action.type 让管理者去匹配要做的事情
    switch (action.type){
        case 'add':
            return {
                ...state,
                num: state.num + 1
            }
        case 'minus':
            return {
                ...state,
                num: state.num - 1
            }
        // 没有匹配到的方法 就返回默认的值
        default:
            return state;
    }
}

let initState = {
    num: 0,
}
const store = creatStore(reducer,initState);
//订阅
store.subscribe(() => {
    let state = store.getState()
    console.log(state.num)
})
```
为了看清楚结果，dispatch(订阅)我直接在控制台输出，如下图：
![](https://user-gold-cdn.xitu.io/2019/3/1/16939e077bd81e62?w=374&h=560&f=png&s=22482)

效果很好，我们不会再因为写错，而出现 NaN 或者其他不可描述的问题。现在这个 dispatch 比较纯粹了一点。

我们只是给他一个 type ，然后让管理者自己去帮我们处理如何更改状态。如果不小心写错，或者随便给个 type 那么管理者匹配不到那么这个动作那么我们这次 dispatch 就是无效的，会返回我们自己的默认 state。

>  好叻，现在这个样子基本上就是我脑海中第一次使用 redux 看到的样子。那个时候我使用起来都非常困难。当时勉强实现了一下这个计数器 demo 我就默默的关闭了 vs code。

接下来我们再完善一下这个 reducer，给他再添加一个方法。并且这次我们再给 state 一个
```javascript
function reducer(state, action) {
    //通过传进来的 action.type 让管理者去匹配要做的事情
    switch (action.type){
        case 'add':
            return {
                ...state,
                num: state.num + 1
            }
        case 'minus':
            return {
                ...state,
                num: state.num - 1
            }
        // 增加一个可以传参的方法，让他更加灵活
        case 'changeNum':
            return {
                ...state,
                num: state.num + action.val
            }
        // 没有匹配到的方法 就返回默认的值
        default:
            return state;
    }
}

let initState = {
    num: 0,
}
const store = creatStore(reducer,initState);
//订阅
store.subscribe(() => {
    let state = store.getState()
    console.log(state.num)
})
```
控制台再使用一次新的方法：

![](https://user-gold-cdn.xitu.io/2019/3/2/1693a051c828b2f5?w=402&h=518&f=png&s=21370)

好叻，这样是不是就让 dispatch 更加灵活了。

现在我们在 reducer 中就写了 3 个方法，但是实际项目中，方法一定是很多的，那么都这样写下去，一定是不利于开发和维护的。那么这个问题就留给大家去思考一下。

> 提示：Redux 也知道这一点，所以他提供了 `combineReducers` 去实现这个模式。这是一个高阶 Reducer 的示例，他接收一个拆分后 reducer 函数组成的对象，返回一个新的 Reducer 函数。 

思考完之后可以参考  [ redux 中文文档 ](https://www.redux.org.cn/docs/recipes/reducers/UsingCombineReducers.html) 的combineReducers介绍


### 总结

Redux 这个项目里，有很多非常巧妙的方法，很多地方可以借鉴。毕竟这可是在 github 上有 47W+ 的 Star。

今天也只是讲了他的一小部分。自己也在努力学习中，希望今后能分享更多的看法，并和大家深入探讨。

### 写在最后

上述每个案例，和代码我都托管在 github 上了，分享给大家可以直接打开即用。[github 传送门](https://github.com/zouxiaomingya/Rudex)

> 全文章，如有错误或不严谨的地方，请务必给予指正，谢谢！

参考：

- [redux 中文文档](https://www.redux.org.cn/)
- [JavaScript设计模式之观察者模式（学习笔记）](https://www.cnblogs.com/gradolabs/p/4786782.html)


