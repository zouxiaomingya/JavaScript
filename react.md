### React.js

React只是一个视图层框架

#### 使用方法

直接在脚手架中使用

首先需要创建项目

npx create-react-app my-app

> 以前我们都是先全局安装了create-react-app，然后再利用这个脚手架工具来创建项目，npx命令可以让我们再创建项目的同时去临时下载这个工具，使用之后会删除，不占用空间 

初始化项目后，发现脚手架中没有配置之类的文件，是因为都集成再react-scripts包中，当然，我们可以将配置抽离出来

yarn eject


react的开发包含两个核心js: react.js / react-dom.js ，分别还有React和ReactDOM核心对象

在创建组件等地方都用得到React对象，而在渲染组件的时候需要用到ReactDOM组件

ReactDOM.render(Component, element); 将组件渲染到页面中某一个dom中 (其实页可以直接渲染一个虚拟dom)
ReactDOM.unmountComponentAtNode(elememt); 将页面的某个元素中渲染的组件卸载掉

实现渲染helloworld的时候：

```react
ReactDOM.render(

    <h1>Hello World</h1>, 

document.getElementById('root'));

```

我们发现居然可以在js中编写标签的代码，其实我们会对这样的代码进行编译，编译成createElememnt的模式，这样的化浏览器就识别

createElement创建出来的其实是虚拟dom, 也就是说，直接渲染的是createElement创建出来的虚拟dom，当然我们可以直接来创建虚拟dom，不使用标签的写法，而这样的做法成本太高

于是react提供了我们类似于标签的写法来帮助我们构建组件的虚拟dom结构。

而这种能帮我们快速构建的类似于html标签的语法叫做 JSX （语法糖）

#### JSX

JSX的全称： Javascript XML

因为这种语法借鉴了xml的语法，因为xml语法更严格, 让开发和编译更有迹可循

* 标签必须闭合
* 外层必须有根节点

jsx中的表达式作用和vue一样，是{}

标签属性:

    * class => className
    * 绑定数据直接写表达式，字符串可以直接写
    * style = {styleObj}   styleObj = { width: '100px', backgrounColor: 'red'}
注释: {/* */}

表单:

    checked => defaultChecked
    value   => defaultValue
    label-for => htmlFor

#### Component

react中组件有很多种无状态组件，有状态组件，影子组件，高阶组件，容器组件（智能组件），UI组件（木偶组件），纯组件。。。。

> 组件必须写成大驼峰写法

无状态组件：

就是一个函数，需要返回出虚拟dom结构, 无法设置自己的状态，只能被动的接收属性，接收到的参数其实就是props

一般情况下，如果我们需要封装一个组件，这个组件没有自己的逻辑部分，仅仅是接收到数据然后构建展示的用户界面的化，就可以构建成无状态组件

无状态组件没有实例，因为每次使用的时候只是执行一次得到jsx结构

有状态组件：

利用ES6类来构建

class ComponentName extends React.Component {

}

必须拥有render函数来构建界面结构, Fragment类似于vue的template


组件如何挂载数据呢？？？

组件拥有两种数据： props（属性） 和 state（状态）

props代表从外界传入的数据，组件自身可以设置属性的默认值， 组件不允许更改自己的属性（单向数据流）

state代表自身的数据，外界无法更改组件自己的state，组件自己维护自己的state

props: 

组件可以利用defaultProps来设置默认属性，外界传入的时候会被覆盖掉，外界可以通过在组件tag上设置属性来传入props


> 在react中没有指令，所以大多数情况需要自己利用js来实现逻辑，例如，循环数据的时候需要自己处理(利用数组的map方法)


state：

组件可以在类中或者类的constructor中设置组件的状态，需要更改的状态的时候使用setState方法

setState是异步的，而且setState会将状态变化合并在一起

setState有两种写法....

#### 事件处理

在react中给虚拟dom中的元素绑定事件，需要通过 onEventType = { handler }

传入方法的时候this会丢掉，可以使用很多种方式解决 (属性初始化器)


#### ref

再react中有的时候同样需要对render中的虚拟dom节点或者子组件做标记，依然可以使用ref

写法：

ref = "el"  / this.refs.el

ref = { el => this.el } / this.el (推荐!)



this.myRef = React.createRef()

<div ref={this.myRef} />

---

<div dangerouslySetInnerHTML> = {{__html:data}} </div>   解析html 方法


#### 受控组件和非受控组件

在表单操作中，经常需要使用到input的value值，我们可以定义一条对应的状态，然后为input绑定change/input事件，当其触发的时候更改state，可以直接利用state为input设置默认的value，这种编写出来的，值由react控制的表单元素，我们称为受控组件

有的时候，例如input-file不适合用受控组件实现，所以需要利用ref来为input做标记，需要的时候直接获取到input节点来操作，这种做法中，input表单元素被称为 非受控组件


#### 组件通信

1. 父子组件

* 父组件 -> state -> 数据 -> props -> 子组件

* 父组件 -> handelr -> props -> 子组件

* context，利用context API可以实现在组件树上进行随意的数据传递，不会一层层传递啦，逻辑清晰，出错几率低

> 函数生成的组件，不能使用ref

2. 非父子组件

* 通信的目的一般就是数据访问，所以发现将需要通信的数据放在它们共同的父级组件身上，通信是最简单的，这种做法就叫++状态提升++

    需要共享的数据提升至其共同的父级组件身上

* 利用发布订阅模式实现 vue 中事件总线的能力


#### 组合 （slot）

在react中，如果我们将部分内容写入到使用组件时的标签内部（类似于vue中的slot）的时候，在组件内部，可以利用this.props.children来获取这些内容，放入到合适的位置

当然，我们也可以为这些内容做一个简单的标记，在组件内部判断这些标记后放入指定的位置，实现具名插槽的效果


#### 数据验证

当子组接收到父级组件传入的数据的时候，其实是很有必要做一个验证的，尤其是在多人协作/封装公用的(功能/UI)组件的过程中，因为我们写的这个组件很可能被其他组件使用，一旦数据传入的不正常，最好能报错说明情况，减少调试成本。

使用方法：

引入prop-types包，为类设置propTypes属性，在其中可以利用包中的PropTypes对属性进行验证

并且我们可以将其写入class类中，需要设置为static属性

其实我们也可以在项目中使用静态类型检查器，如flow/ts

flow和ts不是js的原生语法，只是一种语法糖，在编写的过程中能检查出错误，再生成环境中会被编译成ES，所以只是在开发的过程中/编码的过程中进行验证


#### super在干嘛

在ES6的类中，每一个类都有一个contructor（构造器）,当子类去继承父类的时候，父类的constructor需要执行一下，为子类去继承constructor中的一些东西，如果子类自己没有写constructor，默认的会生成一个constructor并且在其中就会执行弗雷的constructor，执行的方法就是super(),因为子类中的super就是父类的constructor

如果子类自己编写了constructor，那么就需要子类自己去super一次, 否则，子类的this将不被初始化

此时，子类的constructor就可以接收到外界传入的props，但是this上访问不到props，如果在constructor中需要使用到this.props，那么就必须在super中传入props，父类构造器就会为子类的this上挂载props


#### 生命周期

生命周期依然分为三个阶段： 初始化，运行中，销毁阶段

初始化阶段:

实例化组件（类）以得到组件实例，此时组件的constructor会先执行

constructor beforeCreate + created：

    * 绑定this
    * 设置props
    * 根据属性设置状态
    * bind方法的this

componentWillMount / beforeMount:

    修改state，不会触发update，可以做数据的初始化获取

render:

返回一段jsx结构，去渲染...

> 在vue中，vue会判断此数据有没有使用（在模板中渲染）,如果没有，即使改变也不会重新渲染，在react中，只要状态发送了改变（setState），都会重新render


componentDidMount / mounted:

可以操作真实的dom，初始化结束...

父组件在render的过程中会触发子组件的初始化阶段，当所有的子组件都装载完成后，父组件才会执行didmount

> 类中的默认属性是组件实例共享的，因为组件实例无法更改这个默认属性，传入后使用传入的属性，对默认属性没有破坏，所以可以共享，状态则不然，需要为每一个组件的实例挂载自己唯一的状态

运行中阶段:

当组件mounted之后，就进入了运行中阶段，此时只要数据（props，state）变化就会触发对应的生命周期钩子函数：


属性变化：

componentWillReceiveProps:

    属性变化后执行，在这里，新的属性还没有挂载到this上，param props是最新的props
    
    可以根据变化后的属性去更改自己的状态，此时不会因为状态的改变而去执行额外的钩子函数



即使变化后的属性和状态和原来一样，也算变化

shouleComponentUpdate:

当属性或者状态变化后都会执行，需要返回true和false，默认返回true，控制是否执行下面的钩子函数（是否重新渲染）

此时，this上的属性和状态还不是最新的，最新的需要从函数参数中取得，可以根据数据的变化来避免不必要的重新render

封装了baseComponent，目的是将shouldComponentUpdate抽离出来，在其中对比了属性和状态的当前与最新值，如果相同就返回false，阻止重新渲染，提高性能

但是这种深度检查相等和JSON.stringify性能太差，所以，为了防止跳过必要的更新，还能在一定的程度上阻止没有意义的重新渲染：

react中有一种组件叫纯组件 （pureComponent），可以浅层的对属性/状态的当前值和最新值进行对比




componentWillUpdate / beforeUpdate: ...

render 。。。

componentDidUpdate：

    当数据（属性或状态）变化引起的组件重新渲染后执行，并且无论数据变化，只要重新render都会执行
    
    在vue中如果我们想要等到某一条数据变化所引起的dom重新渲染完成后进行操作，我们不能在updated里使用，因为updated不能分辨是数据变化，只能在watch中使用，但是watch监听到的时候数据刚刚变化，还没有rerender，所以需要使用nextTick
    
    而在react中，我们没有nextTick，但是componentDidUpdate会接收到变化前的数据，我们就可以根据变化前的数据和变化后的数据进行判断处理






销毁阶段：

在react种，当组件被销毁的时候，会执行componentWillUnmount，在这个钩子函数会执行善后工作，因为react组件销毁的时候连带dom一起消失的，所以没有销毁后的钩子

在react种如何销毁组件？组件切换的时候/路由切换的时候,当我们调用 ReactDOM.unmountComponentAtNode(element)




#### 高阶组件 (Higher-Order-Component HOC)

高阶组件是一个函数，能够接受一个组件并返回一个新的组件

主要的目的是复用组件的逻辑

生成一个新组件，新组件承受业务逻辑，并将数据传入给接收的组件，接收的组件变成UI组件，只负责使用数据，而生成的新组件称为容器组件


#### 样式组件 styled component

样式组件可以让我们将css样式与dom整理成组件的形式，便于复用

优点: 让组件化更彻底，生成一个样式组件之后，更便于代码复用/维护

styled componnent其实通过配置，返回一个组件，这个组件中会加上相关的随机的类名，然后将styledcomponent中写入的样式匹配上类名放入到style中去

styled.tagname`css styles`, 生成一个有样式的dom tag
> 后面跟随的模板字符串其实相当于再执行前面的函数并且将自己传入进去

styled.tagname.attrs({...})`css styles` 加入一些属性

styled(component)`css styles` 渲染的还是原来的组件，只是将类名加在了组件的最外层的dom元素身上



#### React-router

版本 4.0

核心组件：

BrowserRouter/HashRouter 确定路由切换模式， 内部会渲染一个Router，这个Router就拥有监听路由变化的能力，并且拥有一些路由属性api，将其挂载到context上，等待Route组件取用

Route 每一个Route都是一个路由组件，这个组件会在合适的时机渲染，同时渲染自己的component中或者render中指定的内容

    exact path component render children

Switch 只匹配一个Route

Redirect 重定向

Link / NavLink

withRouter 高阶组件，为非路由组件包裹Route，使其可以拥有histroy。。。

传参 /:id  match.params.id

封装了自己的Link和NavLink，使其可以通过tag指定生成的元素


路由钩子： react-router中没有提供路由钩子，全部由生命周期钩子函数来处理


#### transition 过渡

react-transition-group

其中CSSTransition 针对的是元素/组件的toggle

TransitionGroup 针对的是列表中元素的新增和删除

#### Redux 基础 

vuex是一个状态管理工具，里面集成了自己的状态管理模式，其中借鉴了FLUX

redux是一个架构模式/状态管理模式，借鉴了flux，在使用的时候需要去搭建redux结构

vuex更针对vue，redux没有与任何一个框架做紧密耦合，也就说可以服务于任意的框架或场景

某个组件的状态，需要共享
某个状态需要在任何地方都可以拿到
一个组件需要改变全局状态
一个组件需要改变另一个组件的状态

store是管理全局状态的，视图可以获取到store的状态，视图产生用户操作后会调用actionCreator的方法来生成一个action，将其dispatch派发给store
store会将当前的状态和此次的action交给reducer处理，reducer处理后需要返回新的状态，此时store就能得知数据的变化，然后回通知视图获取最新的数据

1. 利用createStore创建store的同时，创建reducer，然后将reducer传入进去

2. reducer是一个函数，因为能接收到当前状态和此次的action，并且会默认的执行一次

    reducer每次执行后，返回什么东西，store 的状态就是什么东西

    每一次的执行都会伴随一个action的派生

    所以，交给reducer第一个任务： 为store挂载默认的状态


3. 视图通过调用store.getState的方法来获取数据

4. 创建actionCreators，用来创建对应的action，action是一个动作，用来让store判断后更改数据

    action身上需要有唯一标识：type

5. 视图调用store身上的dispatch方法将action发送给store

6. store会将action和当前的状态交给reducer处理，reducer根据action的标识信息需要进行一些逻辑判断


+++++++++++Redux 提供了 combineReducers() 工具类来做上面 todoApp 做的事情，这样就能消灭一些样板代码了。有了它，可以这样重构 todoApp：

三大原则：

1. 唯一数据源

2. reducer必须是纯函数（输入必须对应着唯一的输出）

3. State 是只读的, 想要更改必须经过派发action


划分reducer：

在开发过程中，因为协同开发的参与者较多，而且业务逻辑复杂，为了使逻辑更清晰，希望能将状态管理划分模块，又因为有唯一数据源的原则，所以只能有一个store，所以我们可以去划分reducer，然后再利用combineReducers的方法将reducer合并在一起，注意，此时，状态会根据划分出的reducer来分块存储


异步actions -> 中间件

当业务中出现了异步动作，而且要通过异步动作来更改state，所以我们思考这个异步动作写在哪里?

reducer中不能做异步动作 ， 可以写在组件中，异步动作结束结束后再去派发同步的action，但是这样的话导致组件中的逻辑变的不纯粹

最好是放在action生成函数中进行异步动作，那么问题来了：

此时，action生成函数不能直接返回一个action，因为再函数中要通过异步操作后才能得到相关的action

此时可以使用redux-thunk中间件来进行处理

这个中间件的作用就是让store.dispatch如果接收到函数的时候，去执行这个函数并将dispatch传入进去



redux-promise-middleware

> 注意，引入之后需要执行

此时，我们的actionCreator就可以返回一个action，action的身上有payload，paylod是一个promise

只要我们store.dispatch发送这个actionCreatr返回的action，中间件就自动的发送一个pending的action，分别再fulfilled和reject的时候都会发送对应的action

> 注意，无论我们划分了多少reducer，当派发action的时候，这些reducer都能接收到



#### immutable.js

因为js的对象类型都是mutable的，所以偶尔会导致引用地址传递，从而带来一些问题，immutable认为，数据不应该是可变的，更改后应该返回新的 数据

与immutable实现了这样的功能，创建了Map/Set/List/Seq。。。。类型，还有很多好用的方法：is ,merge ...

并且immutbale做了优化:

    1. 更改数据后会产生新的 数据。但是如果此次更改没有本质上的更新的话，不会产生新的数据
    
    2. 更改数据后创建新数据的时候，会将更改之后的数据节点以及其相关的父级节点进行重新构建，其他地方共享复用


... 

#### react-redux

redux不是针对react来使用的，所以在react中使用的时候需要编写很多的冗余逻辑：

1. 组件获取状态
2. 组件订阅状态的变化之后更新自己的状态

于是，我们一般都采用一个react-redux的工具来在react中链接redux

react-redux提供了两个核心的API：

Provider/connect

Provider在使用的时候需要包在所有组件的最外层，并且为其传入store，作用是在context树上挂载store，等待容器组件取用

connect函数能返回一个高阶组件，高阶组件生成的容器组件就可以得到store了，传入给UI组件后，UI组件就可以使用到这些store的相关api

到底容器组件给ui组件传入哪些东西，由高阶组件决定，因为容器组件是高阶组件根据ui组件生成的，高阶组件又是connect函数生成的

所以：

    connect函数就可以控制容器组件给ui组件传入哪些与store相关的信息

connect函数通过传入参数来生成不同功能的高阶组件 -> ... -> uicomponent得到我们想要的东西


connect函数有两个参数（func）:

1. mapStateToProps 遍历store的状态到UI组件的属性上

    这个函数可以接收到store中的state
    返回什么，容器组件就会从store中取出什么，并且订阅状态变化后给UI组件传入进去

2. mapDispatchToProps

    这个函数可以接收到store中的dispatch
    返回什么，容器组件就会给UI组件传入什么，因为能接收到dispatch，所以可以在这里返回很多dispatch action的方法，UI组件就可以获取后直接调用

<!-- connect

connect()// hoc

connect()(Uicomponent) // container -->
