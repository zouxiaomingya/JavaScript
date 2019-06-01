## 模拟 New 操作符

**new 运算符**创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例

1. 创建一个空的简单 JavaScript 对象（即 {}）；
2. 连接该对象（即设置该对象的构造函数）到另一个对象 ；
3. 将步骤1新创建的对象作为`this`的上下文 ；
4. 如果该函数没有返回对象，则返回`this`。

### 用法实例讲解

> 1. 当构造函数没有返回值时：

```javascript
function Animal (name, age) {
  this.name = name;
  this.age = age;
  this.speak = '汪汪'
}
Animal.prototype.color = 'red';

Animal.prototype.say = function () {
  console.log('我会叫--' + this.speak);
}

var dog = new Animal('旺财', '3');

console.log(dog.name) // 旺财 
// 打印一个没有的属性
console.log(dog.eat) // undefined 
console.log(dog.age) // 3
console.log(dog.speak) // 汪汪
console.log(dog.color) // red
dog.say(); // 我会叫--汪汪
```

> 2. 当构造函数有返回值，且返回值类型为对象的（不包含 null ）

有返回对象的，new 实例化后的对象就是返回的对象。拿不到内部其他的属性，也不会获取到原型上的属性和方法

```javascript
function Animal2 (name, age) {
  this.name = name;
  this.age = age;
  this.speak = '汪汪'
  return {
    name,
    eat: '吃骨头',
  }
}
Animal2.prototype.color = 'red';

Animal2.prototype.say = function () {
  console.log('我会叫--' + this.speak);
}

var dog = new Animal2('旺财', '3');

console.log(dog.name) // 旺财
console.log(dog.eat) // 吃骨头
console.log(dog.age) // undefined
console.log(dog.speak) // undefined
console.log(dog.color) // undefined
dog.say(); // 报错： dog.say is not a function
```

> 3. 构造函数返回 null,

这种情况实际上和第一种情况一样（相当于构造函数没有返回值）

当时确实要注意的是，typeof null === 'object' 所有在实现的时候，我们要进行处理。不能看到 typeof 返回的是object，那么就返回该值。具体实例看下面的讲解。

```javascript
function Animal3 (name, age) {
  this.name = name;
  this.age = age;
  this.speak = '汪汪'
  return null
}
Animal3.prototype.color = 'red';

Animal3.prototype.say = function () {
  console.log('我会叫--' + this.speak);
}

var dog = new Animal3('旺财', '3');

console.log(dog.name) // 旺财
console.log(dog.age) // 3
console.log(dog.speak) // 汪汪
console.log(dog.color) // red
dog.say(); // 我会叫--汪汪
```

### 实现代码

```javascript
function fakeNew() {

    var obj = {};
	// 获取第一个参数，并且会删除第一个参数
    var Constructor = [].shift.call(arguments);
    
	// obj 继承构造函数上的方法
    obj.__proto__ = Constructor.prototype;

    // Constructor 方法中的 this 指向 obj, 执行 Constructor 方法，相当于给 obj 继承了Constructor 中的属性，方法。 （可以理解就是通过 apply 实现继承）
    var result = Constructor.apply(obj, arguments);
    if（typeof result === 'object'）{
        // result || obj 防止返回的是 null（因为 typeof null == 'object'）;
        return result || obj;
    } else {
        return obj;
    }
};
```

> 我们来简写一下 New ，通过 ES6 写很简单 3 行代码搞定。

```javascript
function fakeNew(Constructor, ...rest) {
	// Object.create 方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
    var obj = Object.create(Constructor.prototype),
    var result = Constructor.apply(obj, rest);
    return typeof result === 'object' ? result || obj : obj;

};
```

为什么会通过 Object.create 方法来实现让对象的原型继承 Constructor.prototype 属性呢？

> 由于现代 JavaScript 引擎优化属性访问所带来的特性的关系，更改对象的 `[[Prototype]]`在***各个***浏览器和 JavaScript 引擎上都是一个很慢的操作。其在更改继承的性能上的影响是微妙而又广泛的，这不仅仅限于 `obj.__proto__ = ...` 语句上的时间花费，而且可能会延伸到***任何***代码，那些可以访问***任何***`[[Prototype]]`已被更改的对象的代码。如果你关心性能，你应该避免设置一个对象的 `[[Prototype]]`。相反，你应该使用 [`Object.create()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)来创建带有你想要的`[[Prototype]]`的新对象。

出自 [MDN](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf>) 原话

也就是说 `Object.setPrototypeOf(obj, Constructor.prototype)`  和

 `var obj = {};obj.__proto__ = Constructor.prototype ` 两种方法，无论在写法还是性能上都没有 `Object.create` 方法来的更好

### apply做了什么？

> 上面模拟实现的 new 方法中 `var result = Constructor.apply(obj, rest)`; 这行代码做了什么？

其实就是通过 apply 来实现属性和方法的继承。不清楚的同学可以看下 apply 的模拟实现过程。

### apply 的模拟实现

```javascript
Function.prototype.fakeApply = function (obj, arr) {
    var context = obj || window;
    context.fn = this;
    var result;
    if (!arr) {
        result = context.fn();
    } else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }
    delete context.fn
    return result;
}
```

> 我们用 ES6 写法来简写一下 apply 

```javascript
Function.prototype.fakeApply = function(obj, arr = []) {
  var context = obj || window;
  context.fn = this;
  result = context.fn(...arr);
  delete context.fn;
  return result
};
```

> 同理 call 的模拟方法

```javascript
// 通过...arr 接收后面所有的参数
Function.prototype.fakeCall = function(obj, ...arr) {
  var context = obj || window;
  context.fn = this;
  // 将接受的参数展开执行
  result = context.fn(...arr);
  delete context.fn;
  return result
}; 
```

在开发过程中根据实际情况选择使用方式，那么都可以用的话建议选择 call 方法，因为 **call 的性能高于 aplly。**

> 因为 apply 第二个参数是数组，最终执行的时候还是要将数组转变成一个一个参数，来执行函数，因此性能比 apply 差 ( 也就是差一点点 ）

##  高阶函数

### Array.prototype.map

```javascript
  Array.prototype.myMap = function(fn){
    const arr = this;
    const newArr = [];
    for(let i = 0; i<arr.length; i++){
      var temp = fn(arr[i], i, arr)
      newArr.push(temp);
    }
    return newArr;
  }
```

完整的 map 他是有第二个参数的

Array.map( callback [, thisArg ] )

> callback
>
>    原数组中的元素调用该方法后返回一个新数组。它接收三个参数，分别为 currentValue、index、array。
>
>    currentValue
>
> ​     callback的第一个参数，数组中当前被传递的元素。
>
>    index
>
> ​     callback的第二个参数，数组中当前被传递的元素的索引。
>
>    array
>
> ​     callback的第三个参数，调用map()方法的数组，即原数组。
>
>  thisArg

>    执行callback函数时this指向的对象



Array.prototype.map polyfill源码实现：[地址](https://github.com/billfeller/billfeller.github.io/issues/210)[传送门](https://github.com/billfeller/billfeller.github.io/issues/210)

```javascript
// 实现 ECMA-262, Edition 5, 15.4.4.18
// 参考: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }

    // 1. 将O赋值为调用map方法的数组.
    var O = Object(this);

    // 2.将len赋值为数组O的长度.
    var len = O.length >>> 0;

    // 3.如果callback不是函数,则抛出TypeError异常.
    if (Object.prototype.toString.call(callback) != "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }

    // 4. 如果参数thisArg有值,则将T赋值为thisArg;否则T为undefined.
    if (thisArg) {
      T = thisArg;
    }

    // 5. 创建新数组A,长度为原数组O长度len
    A = new Array(len);

    // 6. 将k赋值为0
    k = 0;

    // 7. 当 k < len 时,执行循环.
    while(k < len) {

      var kValue, mappedValue;

      //遍历O,k为原数组索引
      if (k in O) {

        //kValue为索引k对应的值.
        kValue = O[ k ];

        // 执行callback,this指向T,参数有三个.分别是kValue:值,k:索引,O:原数组.
        mappedValue = callback.call(T, kValue, k, O);

        // 返回值添加到新数组A中.
        A[ k ] = mappedValue;
      }
      // k自增1
      k++;
    }

    // 8. 返回新数组A
    return A;
  };      
}
```



### Array.prototype.reduce

> 简易实现

```javascript
Array.prototype.myReduce = function(callback, initialValue ) {
     var previous = initialValue, k = 0, length = this.length;
    // 如果没有传入 initialValue 就默认将数组的第 0 个赋给 previous
     if (typeof initialValue === "undefined") {
        previous = this[0];
        k = 1;
     }
    if (typeof callback === "function") {
      for (k; k < length; k++) {
        this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
      }
    } 
    return previous;
  };
```



### Array.prototype.forEach

> 简易实现

```javascript
Array.prototype.MyForEach = function(fn) {
    const arr = this
    for(let i = 0; i<arr.length; i++){
        fn(arr[i],i,arr)
    }
  }
```



## 深拷贝

```javascript
  const deepCopy = function(obj){
    return Object.keys(obj).reduce(function (copy, item){
      // 如果对象的 value 类型为 object 就再次执行 deepCopy 来实现深拷贝
      copy[item] = typeof obj[item] === 'object' ? deepCopy(obj[item]) : obj[item];
      return copy;
      // 判断 obj 是 数组类型 还是对象类型 这样 copy 就是 [] 或者是 {}
    }, Object.prototype.toString.call(obj) === '[object Array]' ? [] : {})
  }
```

使用箭头函数和 ，逗号运算符，简化

```javascript
const deepCopy = obj => Object.keys(obj).reduce(
  (copy, item) => (copy[item] = typeof obj[item] === 'object' ? deepCopy(obj[item]) : obj[item], copy)
  ,Object.prototype.toString.call(obj) === '[object Array]' ? [] : {}
);
```



## javaScript 循环

### for 循环

```javascript
for(var i=1;i<=3;i++)
{
　　for(var i=1;i<3;i++)
　　{
　　　　console.log(i)
　　}
}
// 1 2

for(let i=1;i<=3;i++)
{
　　for(let i=1;i<3;i++)
　　{
　　　　console.log(i)
　　}
}
// 1 2 1 2 1 2
```

### do-while

> 先执行一次再去做判断

```javascript
var a = 10
do{
  console.log(a--)
} while (a>2)
```

### while

> 先判断， 再执行

```javascript
while(i<=10)
{
　　循环体
 　　i++
}
```

### for in

#### 实例

```javascript
var obj = {
  a: 1,
  b: [],
  c: function () {}
};
for (var key in obj) {
   console.log(key);
}
// 结果是：
// a
// b
// c
```

#### 注意：

```javascript
Object.prototype.objCustom = function() {}; 
Array.prototype.arrCustom = function() {};

var arr = [3, 5, 7];
arr.foo = 'hello';

for (var i in arr) {
   console.log(i);
}
// 结果是：
// 0
// 1
// 2
// foo
// arrCustom
// objCustom  
```

自定义的 Array.prototype 上的方法也会遍历出来，通过原型链最后还能遍历到 arr.__proto__.__proto__  Object.prototype 上的objCustom



#### 解决方案：

> hasOwnProperty() 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性

```javascript
Object.prototype.objCustom = function() {}; 
Array.prototype.arrCustom = function() {};

var arr = [3, 5, 7];
arr.foo = 'hello';

for (var i in arr) {
   if (arr.hasOwnProperty(i)) {
    console.log(i);
  }
}
// 结果是：
// 0
// 1
// 2
// foo
```



数组上面本身的属性还是会遍历出来

如果不想要本身的属性可以通过 forEach 来实现



```javascript
Object.prototype.objCustom = function() {}; 
Array.prototype.arrCustom = function() {};

var arr = [3, 5, 7];
arr.foo = 'hello';

arr.forEach((item, index)=>{
  console.log(item, index)
})
// 结果是：
// 3 0
// 5 1
// 7 2
```



或者通过 for of 来实现

### for of

> for of 需要遍历可迭代（iterable）的类型

```javascript
var obj = {
  a: 1,
  b: [],
  c: function () {}
};
for (var key of obj) {
   console.log(key);
}
// 出错：
// Uncaught TypeError: obj is not iterable
```

ES6 标准不认为 Object 对象是可迭代的,所以不能用 for-of 遍历之

> 可迭代的类型有 **Array**、 Map、Set、arguments 类对象、NodeList 这类 DOM 集合、String**、**generators

### 最后

> 全文章，如有错误或不严谨的地方，请务必给予指正，谢谢！

参考

- [MDN文档](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf>)
- [鑫空间，鑫生活](<https://www.zhangxinxu.com/wordpress/2018/08/for-in-es6-for-of/>)