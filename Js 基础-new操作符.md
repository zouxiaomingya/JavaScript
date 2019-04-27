### js 基础

#### 模拟 New 操作符

**new 运算符**创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例

1. 创建一个空的简单 JavaScript 对象（即 {}）；
2. 连接该对象（即设置该对象的构造函数）到另一个对象 ；
3. 将步骤1新创建的对象作为`this`的上下文 ；
4. 如果该函数没有返回对象，则返回`this`。

##### 用法实例讲解

> 1. 构造函数没有返回值

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

> 2. 构造函数有返回值，返回值类型为对象的（不包含 null ）

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
console.log(dog.color) // red
dog.say(); // 报错： dog.say is not a function
```

> 3. 构造函数返回 null

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
console.log(dog.eat) // undefined
console.log(dog.age) // 3
console.log(dog.speak) // 汪汪
console.log(dog.color) // red
dog.say(); // 我会叫--汪汪
```

##### 实现代码

```javascript
function fakeNew() {

    var obj = {};
	// 获取第一个参数，并且会删除第一个参数
    var Constructor = [].shift.call(arguments);
    
	// obj 继承构造函数上的方法
    obj.__proto__ = Constructor.prototype;

    // Constructor 方法中的 this 指向 obj, 执行 Constructor 方法，相当于给 obj 继承了Constructor 中的属性，方法。 （可以理解就是通过 apply 实现继承）
    var result = Constructor.apply(obj, arguments);
    if（typeof ret === 'object'）{
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
    return typeof ret === 'object' ? result || obj : obj;

};
```

#### apply 的模拟实现

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

根据实际情况选择使用方式，那么都可以用的话建议选择 call 方法，因为 **call 的性能高于 aplly。**

> 因为 apply 第二个参数是数组，最终执行的时候还是要将数组转变成一个一个参数，来执行函数，因此性能比 apply 差 ( 也就是差一点点 ）
