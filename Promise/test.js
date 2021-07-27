// 类调用类中的方法

// class Animal{
//     constructor(color, fn){
//         this.color = color;
//         fn.call(this,this.getColor.bind(this));
//     }
//     getColor (){
//         console.log(this)
//         return this.color;
//     }
// }

// const cat = new Animal('black', function(fn){
//     console.log(this, '>>>>')
//     const color = fn();
//     console.log(color);
// })

const AjPromise = require("./polyfill_class");
function getList() {
  return new AjPromise((resolve, reject) => {
    resolve(222);
    return 11;
  });
}
const list = getList().then((data) => {
  console.log(data, ">>>");
  return 1;
});

list
  .then((data) => {
    console.log(data, "%%%%");
  })
  .then((res) => {
    console.log(res, "res>>>>>>");
    return "over";
  });

console.log(list);
setTimeout(() => console.log(list), 1);
