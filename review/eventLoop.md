## 打印什么
```javaScript
async function async1() {
    console.log("async1 start");
    await  async2();
    console.log("async1 end");
}
async  function async2() {
    console.log( 'async2');
}
console.log("script start");
setTimeout(function () {
    console.log("settimeout");
});
async1()
new Promise(function (resolve) {
    console.log("promise1");
    resolve();
}).then(function () {
    console.log("promise2");
});
setImmediate(()=>{
    console.log("setImmediate")
})
process.nextTick(()=>{
    console.log("process")
})
console.log('script end'); 

```
#### 第一轮：

current task："script start"，"async1 start"，'async2'，"promise1"，“script end”
micro task queue：[async,promise.then,process]
macro task queue：[setTimeout,setImmediate]

#### 第二轮

current task：process，async1 end ,promise.then
micro task queue：[]
macro task queue：[setTimeout,setImmediate]

#### 第三轮

current task：setTimeout,setImmediate
micro task queue：[]
macro task queue：[]

最终结果：[script start，async1 start，async2，promise1，script end,process,async1 end,promise2,setTimeout,setImmediate]
同样"async1 end","promise2"之间的优先级，因平台而异。
