目录

1 从简单使用着手，实现MyPromise大体框架
2 完善MyPromise，添加异步处理和实现一个实例多次调用then方法
3 继续完善，实现MyPromise的链式调用

1 从简单使用着手，实现MyPromise大体框架

先来看一下promise使用的一个小例子：

let p = new Promise(function (resolve, reject) {
  console.log('start')
  resolve('data1')
})
p.then(
  (v) => {
    console.log('success： ' + v)
  },
  (v) => {
    console.log('error： ' + v)
  }
)
console.log('end')


运行结果如下：



针对这个例子做以下几点说明，也是需要直接记住的，因为这就好比是解答数学题的公式一样，开始一定要记牢。


Promise是构造函数，new 出来的实例有then方法。
new Promise时，传递一个参数，这个参数是函数，又被称为执行器函数(executor)， 并执行器会被立即调用，也就是上面结果中start最先输出的原因。
executor是函数，它接受两个参数 resolve reject ，同时这两个参数也是函数。
new Promise后的实例具有状态， 默认状态是等待，当执行器调用resolve后， 实例状态为成功状态， 当执行器调用reject后，实例状态为失败状态。
promise翻译过来是承诺的意思，实例的状态一经改变，不能再次修改，不能成功再变失败，或者反过来也不行。
每一个promise实例都有方法 then ，then中有两个参数 ，我习惯把第一个参数叫做then的成功回调，把第二个参数叫做then的失败回调，这两个参数也都是函数，当执行器调用resolve后，then中第一个参数函数会执行。当执行器调用reject后，then中第二个参数函数会执行。


那么就目前的这些功能，或者说是规则，来着手写一下MyPromise构造函数吧。

1 构造函数的参数，在new 的过程中会立即执行
// 因为会立即执行这个执行器函数
function MyPromise(executor){
  executor(resolve, reject) 
}

2 new出来的实例具有then方法
MyPromise.prototype.then = function(onFulfilled, onRejected){
    
}

3 new出来的实例具有默认状态，执行器执行resolve或者reject，修改状态
function MyPromise(executor){
  let self = this
  self.status = 'pending' // 默认promise状态是pending
  function resolve(value){
    self.status = 'resolved' // 成功状态
  }
  function reject(reason){
    self.status = 'rejected' //失败状态
  }
  executor(resolve, reject) 
}

4 当执行器调用resolve后，then中第一个参数函数（成功回调）会执行,当执行器调用reject后，then中第二个参数函数（失败回调）会执行
MyPromise.prototype.then = function(onFulfilled, onRejected){
  let self = this
  if(self.status === 'resolved'){
    onFulfilled()
  }
  if(self.status === 'rejected'){
    onRejected()
  }
}

5 保证promise实例状态一旦变更不能再次改变，只有在pending时候才可以变状态
function Promise(executor){
  let self = this
  self.status = 'pending' // 默认promise状态是pending
  function resolve(value){
    if(self.status === 'pending'){ //保证状态一旦变更，不能再次修改
      self.value = value
      self.status = 'resolved' // 成功状态
    }
  }
  function reject(reason){
    if(self.status === 'pending'){
      self.reason = reason
      self.status = 'rejected' //失败状态
    }
  }
  executor(resolve, reject)
}

6 执行器执行resolve方法传的值，传递给then中第一个参数函数中
function MyPromise(executor){
  let self = this
  self.value = undefined
  self.reason = undefined
  self.status = 'pending' // 默认promise状态是pending
  function resolve(value){
    if(self.status === 'pending'){ //保证状态一旦变更，不能再次修改
      self.value = value
      self.status = 'resolved' // 成功状态
    }
  }
  function reject(reason){
    if(self.status === 'pending'){
      self.reason = reason
      self.status = 'rejected' //失败状态
    }
  }
  executor(resolve, reject) // 因为会立即执行这个执行器函数
}

MyPromise.prototype.then = function(onFulfilled, onRejected){
  let self = this
  if(self.status === 'resolved'){
    onFulfilled(self.value)
  }
  if(self.status === 'rejected'){
    onRejected(self.reason)
  }
}


尝试使用一下这个 MyPromise ：

let p = new MyPromise(function (resolve, reject) {
  console.log('start')
  resolve('data2')
})
p.then(
  (v) => {
    console.log('success ' + v)
  },
  (v) => {
  console.log('error ' + v)
  }
)
console.log('end')


运行结果如下：



小结：结果看似对了，不过和原生的promise还是有不同的，就是success那条语句的打印顺序，不要急，MyPromise 还没有写完。

2 完善MyPromise，添加异步处理和实现一个实例多次调用then方法

还是看原生promise的使用小例子

let p = new Promise(function (resolve, reject) {
  console.log('start')
  setTimeout(function(){
      resolve('data1')
  },2000)
})
p.then(
  (v) => {
    console.log('success： ' + v)
  },
  (v) => {
    console.log('error： ' + v)
  }
)
console.log('end')


运行结果如下



实例多次调用then方法情况（注意不是链式调用）

let p = new Promise(function (resolve, reject) {
  console.log('start')
  setTimeout(function(){
      resolve('data1')
  },2000)
})
p.then(
  (v) => {
    console.log('success： ' + v)
  },
  (v) => {
    console.log('error： ' + v)
  }
)
p.then(
  (v) => {
    console.log('success： ' + v)
  },
  (v) => {
    console.log('error： ' + v)
  }
)
console.log('end')


运行结果如下



那么针对这种异步的情况和实例p多次调用then方法，我们上述MyPromise该如何修改呢？



对于异步情况，我们先来看上面的例子，当代码执行到了p.then() 的时候，执行器方法中的resolve('data1')被setTimeout放到了异步任务队列中，


换句话说，也就是，此时实例p的状态还是默认状态，没有改变，那么我们此时并不知道要去执行then中的第一个参数（成功回调）还是第二个参数（失败回调）。


在不知道哪个回调会被执行的情况下，就需要先把这两个回调函数保存起来，等到时机成熟，确定调用哪个函数的时候，再拿出来调用。


其实就是发布订阅的一个变种，我们在执行一次p.then(),就会then中的参数，也就是把成功回调和失败回调都保存起来（订阅），执行器执行了resolve方法或者reject方法时，我们去执行刚保存起来的函数（发布）。


此阶段MyPromise升级代码如下
//省略其余等待，突出增加的点，等下发完整版
function MyPromise(executor){
  ...
  // 用来保存then 方法中，第一个参数
  self.onResolvedCallbacks = []
  // 用来保存then 方法中，第二个参数
  self.onRejectedCallbacks = []
  ...
}
MyPromise.prototype.then = function(onFulfilled, onRejected){
  ...
  if(self.status === 'pending'){
  // 订阅
    self.onResolvedCallbacks.push(function(){
      onFulfilled(self.value)
    })
    self.onRejectedCallbacks.push(function(){
      onRejected(self.reason)
    })
  }
  ...
}


小结 这样修改后，我们执行器方法中，有异步函数的情况时，p.then执行就会把对应的两个参数保存起来了。那么在什么时候调用呢？答，肯定是在执行器中的resolve执行时候或者reject执行时候。

接下来贴出这阶段改动的完整代码。
function MyPromise(executor){
  let self = this
  self.value = undefined
  self.reason = undefined
  // 默认promise状态是pending
  self.status = 'pending'
  // 用来保存then 方法中，第一个参数
  self.onResolvedCallbacks = []
  // 用来保存then 方法中，第二个参数
  self.onRejectedCallbacks = []
  function resolve(value){
    if(self.status === 'pending'){ //保证状态一旦变更，不能再次修改
      self.value = value
      self.status = 'resolved' // 成功状态
      self.onResolvedCallbacks.forEach(fn => {
        fn()
      })
    }
  }
  function reject(reason){
    if(self.status === 'pending'){
      self.reason = reason
      self.status = 'rejected' //失败状态
      self.onRejectedCallbacks.forEach(fn => {
        fn()
      })
    }
  }
  executor(resolve, reject) // 因为会立即执行这个执行器函数
}

MyPromise.prototype.then = function(onFulfilled, onRejected){
  let self = this
  if(self.status === 'resolved'){
    onFulfilled(self.value)
  }
  if(self.status === 'rejected'){
    onRejected(self.reason)
  }
  if(self.status === 'pending'){
  // 订阅
    self.onResolvedCallbacks.push(function(){
      onFulfilled(self.value)
    })
    self.onRejectedCallbacks.push(function(){
      onRejected(self.reason)
    })
  }
}


我们来测试一下这个升级版的MyPrimise吧

let p = new MyPromise(function (resolve, reject) {
  console.log('start')
  setTimeout(function(){
      resolve('data1')
  },2000)
})
p.then(
  (v) => {
    console.log('success： ' + v)
  },
  (v) => {
    console.log('error： ' + v)
  }
)
p.then(
  (v) => {
    console.log('success： ' + v)
  },
  (v) => {
    console.log('error： ' + v)
  }
)
console.log('end')


运行结果如下,显示打印start和end，两秒后一起打印的两个 success：data1



小结： 下面这里，为什么能拿到self.value的值，值得好好思考一下呦

self.onResolvedCallbacks.push(function(){
  onFulfilled(self.value)
}) 

3 继续完善，实现MyPromise的链式调用

温馨提示，对于链式调用，这是手写promise中最为复杂的一个阶段，在理解下面的操作之前，希望可以对上面的内容再看一下，否则很有可能造成混乱~

1 实际场景的promise化

有如下场景，第一次读取的是文件名字，拿到文件名字后，再去读这个名字文件的内容。很显然这是两次异步操作，并且第二次的异步操作依赖第一次的异步操作结果。

// 简要说明 创建一个js文件 与这个文件同级的 name.txt, text.txt 
// 其中name.txt内容是text.txt， 而text.txt的内容是 文本1
// node 运行这个js文件

let fs = require('fs')

fs.readFile('./name.txt', 'utf8', function (err, data) {
  console.log(data)
  fs.readFile(data, 'utf8', function (err, data) {
    console.log(data)
  })
})


运行结果如下



很显然，上面的回调模式不是我们想要的，那么我们如何把上面写法给promise化呢？为了表述的更清晰一下，我还是分步来写：

1 封装一个函数，函数返回promise实例
function readFile(url){
  return new Promise((resolve, reject)=>{
  })
}

2 这个函数执行就会返回promise实例，也就是有then方法可以使用
readFile('./name.txt').then(
  () => {},
  () => {}
)

3 完善执行器函数，并且记住执行器函数是同步运行的，即new时候，执行器就执行了
let fs = require('fs')

function readFile(url){
  return new Promise((resolve, reject)=>{
    fs.readFile(url, 'utf8', function (err, data) {
      if(err) reject(err)
        resolve(data)
      })
    })
}

readFile('./name.txt').then(
  (data) => { console.log(data) },
  (err) => { console.log(err) }
)


运行一下这一小段代码，结果如下


4 不使用链式调用
readFile('./name.txt').then(
  (data) => {
    console.log(data)
    readFile(data).then(
      (data) => {console.log(data)},
      (err) => {console.log(err)}
    )
  },
  (err) => {console.log(err)}
)


在回调里加回调，promise说你还不如不用我。运行结果如下：


5 使用链式调用
readFile('./name.txt')
.then(
  (data) => {
    console.log(data)
    return readFile(data)
  },
  (err) => {console.log(err)}
)
.then(
  (data) => { console.log(data) },
  (err) => { console.log(err) }
)


运行结果如下



以上就是一个简单异步场景的promise化。

2 回顾链式调用的常见场景

其实关于链式调用，我们也有一些类似于公式规则一样的东西需要去记住，这是个规范，来自promise A+，传送门在此 promisesaplus.com/，


我在这里就先不罗列promise A+ 的翻译了，先挑出几个干货来，也是我们平时使用promise习以为常的东西。


jquery 链式调用 是因为jquery返回了this，promise能一直then下去，是因为promise的then方法返回了promise
返回的是新的promise，因为上面说过，promise实例状态一旦修改，不能再次修改，所以要返回全新的promise。
then方法中的两个参数，也就是那所谓的成功回调和失败回调，他们的返回值如何处理？
以成功回调函数（then中的第一个参数）为例，这个函数返回普通值，也就是常量或者对象，这个值会传递到下一个then中，作为成功的结果。 如果这个函数返回的不是普通值，那么有两种情况。
非普通值---promise：会根据返回的promise成功还是失败，决定调用下一个then的第一个参数还是第二个参数。
非普通值---如报错异常：会跑到下一个then中的失败参数中，也就是then中的第二个参数。


我们先用原生promise来验证一下这些情况，然后再把这些实现添加到MyPromise中。

验证then中第一个回调返回普通值情况，拿上面例子加以修改
readFile('./name.txt')
.then(
  (data) => {
    console.log(data)
    return {'a': 100} // 1 返回引用类型
    // return 100 // 2 返回基本类型
    // return undefined 3 返回undefined
    // 4 不写return
  },
  (err) => {console.log(err)}
)
.then(
  (data) => { console.log(data) },
  (err) => { console.log(err) }
)


上面4种情况对应 运行结果如下：


验证第一个then中，返回promise情况，链式的第二个then怎么回应
readFile('./name.txt')
.then(
  (data) => {
    console.log(data)
    return new Promise(function(resolve, reject){
      setTimeout(function(){
      // resolve('ok')
      reject('error')
      },1000)
    })
  },
  (err) => {console.log(err)}
)
.then(
  (data) => { console.log(data) },
  (err) => { console.log(err) }
)


运行结果如下,分别是上面执行resolve和reject的结果


验证第一个then中，返回错误情况，链式的第二个then怎么相应
readFile('./name.txt')
.then(
  (data) => {
    console.log(data)
    throw TypeError()
  },
  (err) => {console.log(err)}
)
.then(
  (data) => { console.log(data) },
  (err) => { console.log(err) }
)


执行结果如下


3 基于上述完善MyPromise的链式调用
1 then返回的是全新的promise
MyPromise.prototype.then = function(onFulfilled, onRejected){
  let self = this
  return new MyPromise(function(resolve, reject){
	if(self.status === 'resolved'){...}
	if(self.status === 'rejected'){...}
	if(self.status === 'pending'){...}
  }
} 


小结：可以向上翻一下，对比上一版的MyPromise.prototype.then实现，其实只是原本的逻辑，用MyPromise的执行器函数包裹了一下，而我们又知道，执行器函数是同步执行，在new 实例的时候执行器就会运行，所以就目前来看，加上这个包裹，对原有逻辑不存在什么影响，又实现了只要then方法执行，返回的就是promise实例，并且是全新的promise实例。

2 对于then中函数返回值的处理 普通值情况
MyPromise.prototype.then = function(onFulfilled, onRejected){
  ...
  if(self.status === 'resolved'){
    try{
      let x = onFulfilled(self.value)
      resolve(x)
    }catch(e){
      reject(e)
    }
  }
  ...
}


小结 上面代码我只写了 self.status === 'resolved' 这个状态的，其余两个状态也是一样的写法，我就先拿这一个举例说明。onFulfilled，就是我们的promise实例，执行then方法传的第一个参数，他执行后返回普通值的话，会直接把这个值传递给链式调用的下一个then的成功回调函数中。（这个表述大家应该可以看懂吧）。


好，我们来想一下，通过第一步，已经实现了then方法返回全新的promise，那么，这个全新的promise再去执行then的话，这个then的成功回调和失败回调的参数，也就是这个then的第一个参数需要的value和第二个参数需要的reason，哪里来？


肯定是在这个全新的promise实例的，new 过程中，那个处理器函数中的，resolve或者reject。这里其实是有些绕的。


为了更好的理解上面说的，我再来个图，回顾下之前的例子



输出的是什么呢？ 大家都知道 会先输出 success Ace 后输出 success undefined



所以，上面图中，第一个then返回了新的promise不假，但是没有执行resolve和reject，这种情况就相当于 resolve(undefined) , 所以第二个then，打印的是 success undefined


所以这一小节中的，let x = onFulfilled(self.value) 这里的原由,我啰嗦的挺多了吧~当然，这只是处理普通值的情况。附上这阶段的完整代码。

MyPromise.prototype.then = function(onFulfilled, onRejected){
  let self = this
  let promise2 = new MyPromise(function(resolve, reject){
  // then 函数的成功回调函数的执行结果 与 promise2的关系
  if(self.status === 'resolved'){
    try{
      let x = onFulfilled(self.value)
        resolve(x) // 这是 x 是常量的时候，但x可能是一个新的promise，
    }catch(e){
       reject(e)
    }
  }
  if(self.status === 'rejected'){
    try{
      let x = onRejected(self.reason)
        resolve(x)
      }catch(e){
        reject(e)
      }
  }
  if(self.status === 'pending'){
    self.onResolvedCallbacks.push(function(){
      try{
        let x = onFulfilled(self.value)
        resolve(x)
      }catch(e){
        reject(e)
      }
    })
    self.onRejectedCallbacks.push(function(){
      try{
        let x = onRejected(self.reason)
        resolve(x)
      }catch(e){
        reject(e)
      }
    })
 }
})
return promise2
}


测试上面代码示例如下

let p = new MyPromise(function (resolve, reject) {
  console.log('start')
  setTimeout(function(){
    resolve('data1')
  },500)
})
p.then(
  (v) => {
  console.log('success： ' + v)
  // return v // 1 返回 v
  // return 100 // 2 返回常量
  // return {a : 100} // 3 返回对象
  // return undefined // 4 返回 undefined
  // 5 不写return
  },
  (v) => {
  console.log('error： ' + v)
  }
)
.then(
  (v) => {
    console.log('success： ' + v)
  },
  (v) => {
   console.log('error： ' + v)
  }
)
console.log('end')


对应上面1--5的结果如下


3 对于then中函数返回值的处理 非普通值情况

也就是说对于上面例子，出现了第六种情况,既，then的第一个回调函数，返回了一个新的promise实例

p.then(
  (v) => {
  console.log('success： ' + v)
    return new MyPromise(excutor)
  },
  (v) => {
  console.log('error： ' + v)
  }
)

then的第一个回调函数，对应MyPromise的是onFulfilled，所以我们要对MyPromise.prototype.then 再次改造

MyPromise.prototype.then = function(onFulfilled, onRejected){
  let self = this
  let promise2 = new MyPromise(function(resolve, reject){
    // then 函数的成功回调函数的执行结果 与 promise2的关系
    if(self.status === 'resolved'){
      try{
        let x = onFulfilled(self.value)
        // x可能是一个新的promise , 抽离一个函数来处理x的情况
        resolvePromise(promise2, x, resolve, reject)
      }catch(e){
       reject(e)
      }
    }
    if(self.status === 'rejected'){...}
    if(self.status === 'pending'){...}
  })
  return promise2
}
