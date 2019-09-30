# 一. Number类型关键点讲解

### 1.进制问题

1. 八进制字面量在严格模式下无效，会导致支持该模式的js引擎抛出异常
2. 十六进制字面量的前两位必须是0x，后根任何十六进制数字（0-9及A-F）
3. 在进行算术计算时，所有以八进制和十六进制表示的数值最终将被转换成十进制数值

### 2.浮点数注意点

浮点数值的最高精度是17位小数，但在进行算术计算时精度远远不如整数。例如 0.1 + 0.2 === 0.300000000000004(大致这个意思，具体多少个零请实际计算) 所以永远不要测试某个特定的浮点数值

### 3.数值

1. 使用isFinite(num)来确定一个数字是否有穷
2. ECMAScript能够表示的最小值保存在变量 Number.MIN_VALUE 中，最大值保存在 Number.MAX_VALUE 中。
3. NaN表示非数值。在ECMAScript中，任何数值除以非数值会返回NaN,因此不会影响其他代码的执行。
4. isNaN()用来确定传入的参数是否为"非数值"。会对参数进行转化，不能被转化为数值的则返回true。

### 4.数值转换

parseFloat主要用于解析有效的浮点数字，始终会忽略前导的零，可识别所有的浮点数格式，但是十六进制格式的字符串始终会被转换成零。

# 二. 字符串

### 1. toString() 转换为字符串

```
let num = 10;
num.toString(n) n表示进制，可选，如2，8，10，16
复制代码
```

# 三.循环

### 1. break和continue

- break语句会立即退出循环，强制执行循环后面的语句
- continue语句是退出当前循环，继续执行下一循环

```
// 结合label,更精确的控制循环
outerMost:
for(var i=0;i<10;i++){
    for(var j=0;i<10;j++){
        if(i = 5){
            break outerMost
        }
    }
}
//此时直接退出外部循环，continue也是类似
复制代码
```

### 2. switch语句在比较值时使用的是全等操作符，所以不会发生类型转换

### 3. 函数参数arguments和命名参数

```
function add(n1, n2){
    arguments[1] = 10;
}
复制代码
```

此时读取n2和arguments[1]并不会访问相同的内存空间，他们的内存空间是独立的，但他们的值保持同步

# 四.变量，作用域和内存问题

### 1.传递参数

1.所有的参数都是按值传递的。在向参数传递引用类型的值时，会把这个值在内存中的地址复制给一个局部变量，因此这个局部变量的变化会反应在函数外部

2.当在函数内部重写obj时，这个变量引用的就是一个局部对象。而这个局部对象会在函数执行完毕后立即被销毁。

### 2.垃圾收集

1. js最常用的垃圾收集机制为“标记清除”，另一种不常用的是“引用计数”。
2. 原理：找出不再继续使用的变量，然后释放其内存空间。垃圾收集器会在固定的时间间隔周期性的执行这一操作。

### 3.管理内存

解除引用：数据不再有用，将其值设置为null

# 五.引用类型

### 1.数组总结

```
// 检测数值ES5方法
Array.isArray(value)  // 检测值是否为数组
// 转换方法
toString() 将数组转化为以逗号分隔的字符串
valueOf() 返回的还是数组
// 栈方法
push() 可以接收任意数量的参数，把他们逐个添加到数组的末尾，返回修改后数组的长度
pop() 从数组末尾移除最后一项，返回移除的项
// 队列方法
shift() 移除数组的第一项并返回该项
unshift() 向数组前端添加任意个项并返回新数组的长度
// 排序
sort(compare)
compare函数接收两个参数,如果返回负数，则第一个参数位于第二个参数前面；如果返回零，则两个参数相等；如果返回正数，第一个参数位于第二个参数后面
// 降序，升序相反
(a,b) => (b-a)
// 操作方法
concat(数组 | 一个或多个元素) // 合并数组，返回新数组
slice(起始位置 ，[结束位置]) // 切分数组，返回新数组，新数组不包含结束位置的项
splice(起始位置，删除的个数，[插入的元素]) // 删除|插入|替换数组，返回删除的元素组成的数组，会修改原数组
// 位置方法
indexOf(查找的项，[查找起点位置]) // 使用全等操作符，严格相等
lastIndexOf()
// 迭代方法，都接收两个参数，一个是要在每一项上运行的函数，一个是作用域（可选）
1.every 对数组中每一项运行给定函数，如果函数对每一项都返回true,则返回true
        every(fn(value,index,array){return ...},[this])
2.some 对数组中每一项运行给定函数，如果函数对任一项都返回true,则返回true
3.filter 对数组中每一项运行给定函数，返回该函数会返回true的项组成的数组
4.forEach 对数组每一项运行给定函数，无返回值
5.map 对数组每一项运行给定函数，返回每次函数调用返回结果组成的数组
// 归并方法 reduce和reduceRight(和前者遍历的方向相反),构建一个最终返回的值
reduce(fn(prev,cur,index,array){ return ... },initValue)
1.fn返回的值会作为第一个参数传递给下一项
2.initValue做为归并基础的初始值
复制代码
```

### 2.Date对象

1. new Date(str | year,month,day,...)  可以接收日期格式的字符串，也可以是year, month, day参数的数字
2. Date.now()  返回调用这个方法的日期时间的毫秒数，使用 +new Date()也可以得到相同的效果

### 3.RegExp对象

1. 由于RegExp构造函数的模式参数是字符串，所以在某些情况下要进行双重转义，对于\n双重转义为\\n
2. 使用正则字面量时会共享一个RegExp实例，而正则构造函数会为每次调用创建一个新的regExp实例
3. RegExp实例属性

- global / ignoreCase(忽略大小写)
- lastIndex(表示开始搜索下一个匹配项的字符位置，从零开始)
- source(正则表达式的字符串表示)

1. 实例方法

- .exec(text)  text为要应用模式的字符串，返回包含第一个匹配项信息的数组。 返回值分析: 返回值是数组的实例，但包含两个额外的属性：index(表示匹配项在字符串中的位置)，input表示应用正则表达式的字符串

```
let text = "xd ff gggg";
let pattern = /xd ((ff) gggg)?/g;
let matches = pattern.exec(text); //每次调用都返回一个匹配项，即使是全局模式
matches[0] //与整个模式匹配的字符串
matches[1] // 除了第一项以外，其他项为与模式中捕获组匹配的字符串
复制代码
```

1. test(text)  接收一个字符串参数，在模式与该参数匹配是返回true

```
// RegExp构造函数属性
leftContext | $`(短属性名)  // 匹配项左部文本
rightContext | $'(短属性名)  // 匹配项右部文本
// 案例
if(pattern.test(text)){
    console.log(RegExp.leftContext)  // 或
    console.log(RegExp["$`"])
}
// 用于获取捕获组
RegExp.$1, RegExp.$2, RegExp.$3
复制代码
```

### 4.函数

1. 函数内部属性 arguments对象有一个名叫callee的属性，该属性是一个指针，指向拥有这个arguments对象的函数 arguments.callee(arg) //调用函数自身，在严格模式下运行时会导致错误
2. 函数属性 length 表示函数希望接收的命名参数的个数 prototype 保存所有实例方法
3. 函数方法

```
apply() // 接收两个参数，一个是作用域，另一个是参数数组
call() // 第一个参数是作用域， 剩下的参数是函数需要接收的参数，需要一一列出
bind() // 该方法会创 建一个函数的实例，其this值会被绑定到传给bind()函数的值 IE9+支持
valueOf() / toString() // 返回函数的代码
复制代码
```

### 5.基本包装类型

1. Number

```
toFixed(n) // 按照指定的小数位返回数值的字符串表示（可以自动四舍五入）
复制代码
```

1. String

```
charAt(n) // 返回给定位置的字符
charCodeAt(n) // 返回给定位置的字符编码
"dddd"[n] // 访问字符串特定索引的字符
concat() //用于将一个或多个字符串拼接起来
slice(start, end) / substring(start, end)  // 返回一个新的从开始位置到结束位置的字符串，不包括结束位置
substr(start, len) // 返回一个新的从开始位置到指定长度的字符串
indexOf(str,[startIndex]) // 返回指定字符在字符串中的索引，第二个参数为从指定位置开始搜索，可选
trim() // 该方法会创建一个字符串的副本，删除前置与后缀的所有空格，返回结果
toLowerCase() / toUpperCase() // 小写大写转换
// 字符串的模式匹配方法
1.match(pattern) //本质上与RegExp的exec()方法相同，只接受一个参数，即正则表达式或RegExp对象
2.search(pattern) // 参数与match参数相同，返回字符串中第一个匹配项的索引
3.replace(str | pattern, text | fn)  //第一个参数为想要被替换的字符串或正则表达式，第二个参数为要替换的字符串或一个函数
* 如果第二个参数是字符串，可以使用一些特殊的字符序列，将正则表达式操作得到的值插入到结果字符串中。
    $' //匹配的子字符串之后的子字符串
    $` //匹配的子字符串之前的子字符串
    $n //匹配第n个捕获组的子字符串
* 如果第二个参数是函数，在只有一个匹配项时，会向函数传递3个参数，模式的匹配项，模式的匹配项在字符串中的位置，原始的字符串
                    正则表达式中定义了多个捕获组的情况下，传递的参数依次是模式的匹配项，第一个捕获组的匹配项，第二个捕获组的匹配项...，最后两个参数和上者相同
如：
function htmlEscape(text){
    return text.replace(/[<>&"]/g, (match, pos, originalText) => {
        switch(match){
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "\"":
                return "&quot;"
        }
    })
}

4.split() // 第一个参数是需要指定分隔符匹配中的字符串或者正则表达式，也可以传递第二个参数，用来限制返回数组的长度
例：
let text = "xujaing,red,ddd";
text.split(",")  // ["xujaing", "red", "ddd"]
text.split(",", 2)  // ["xujaing", "red"]
text.split(/[^\,]+/)  //*** 匹配非字母，用字符串的非字母分割字符串，返回数组

* 5.localeCompare() // 比较两个字符串，如果字符串在字母表中排在字符串参数之前，返回负数，相等返回0，反之正数
复制代码
```

1. 单体内置对象

```
Global对象
1.URI编码方法
    encodeURI()           // 除了空格之外其他字符都不编码
    encodeURIComponent()  //会对它发现的任何非标准字符进行编码
    decodeURI()           //只能对使用encodeURI的字符进行解码
    decodeURIComponent()  // 原理同上
    
Math对象
1.Math.max() / Math.min() // 接收任意多数值作为参数
// 求数组中最大值 Math.max.apply(Math, arrValue)
2.Math.ceil() / Math.floor() / Math.round()  //向上/下/四舍五入
3.Math.random()  //返回大于等于0小于1的随机数
4.Math.abs() //返回参数的绝对值
5.Math.pow(num,power) // 返回num的power次幂
6.Math.sqrt(num) // 返回num的平方根
复制代码
```

# 六.面向对象的程序设计

### 1.属性类型

```
// 1.数据属性
    let person = {};
    Object.defineProperty(person, "name", {
        configurable: true,  //表示能否通过delete删除属性从而重新定义属性，能否修改属性
        enumerable: true,  //表示能否通过for-in循环返回属性
        writable: true,  // 表示是否能修改属性的值
        value: "xujiang" // 属性的值
    })
    /* 在调用Object.defineProperty()方法创建一个新属性时，如不指定前三个属性字段，默认值都为false, 如果是修改已定义的属性时，则没有此限制 */

// 2.访问器属性get/set
    let person = {name: "xujaijgn", year: 11};
        Object.defineProperty(person, "_name", {
            get: function(){
                return this.name
            },
            // 定义Set时，则设置一个属性的值时会导致其他属性发生变化
            set: function(newValue){
                this.name = newValue;
                this.year = 12;
            }
        })

// 定义多个属性
Object。defineProperties(book, {
    _year: {
        writable: false,
        value: 2001
    },
    year: {
        get: function(){
            return _year
        },
        set: function(newValue){
            this._year = newValue;
        }
    }
})
复制代码
```

### 2.创建对象

```
1.工厂模式---返回新对象的方式
2.构造函数---定义函数，通过new操作符创建对象（任何函数通过new操作符调用都可以看作构造函数）
   缺点：每个方法在实例中都要重新创建一遍
3.原型模式 （book.prototype.name = "aaa")
    优点：可以让每个实例对象共享它所包含的方法
    缺点： 属性共享，对于引用类型值的属性，实例会共享属性
    理解原型：
        1.isPrototypeOf() // 确定对象之间是否存在原型关系
        2.Object.getPrototypeOf(object1) // 获取实例对象的原型
        3.我们可以通过对象实例访问保存在原型中的值，但却不能通过对象实例重写原型中的值，如果该实例有与原型相同的属   性名，则会屏蔽原型中的属性
        4.hasOwnProperty(name) // 检测一个属性是否在实例中
        5.原型与in操作符 "name" in person  // 对象能访问到给定属性时返回true
        6.Object.keys(obj) // 返回一个包含所有可枚举属性的字符串数组（实例属性）
        7.Object.getOwnPropertyNames() //获取所有实例属性，包括不可美枚举的
        8.实例中的指针只指向原型，而不指向构造函数
        9.重写原型对象会切断现有原型与之前存在的对象实例之间的联系，他们引用的任然是最初的原型
4.组合式（构造函数模式和原型模式）
    1.用构造函数定义实例属性，用原型定义方法和共享属性
5.动态原型模式（通过检查某个应该存在的方法是否存在，来决定需要初始化原型
6.稳妥构造函数模式（适合在某些安全环境下工作）
    function Person(name,year,job){
        var o = new Object();
        // 这里可以添加私有变量和方法
        o.sayName = () => name

        return o
    }
复制代码
```

### 3.继承（原型链是实现继承的主要方式）

```
1.原型链的问题
    1.包含引用类型值的原型属性会被所有实例共享，在通过原型实现继承时，原型实际上会变成另一个类型的实例，原先的实例属性变成了现在的原型属性。
    2.在创建子类型的实例时，无法向父类构造函数传递参数

2.借用构造函数（在子类型构造函数的内部调用父类构造函数）
    //此时实例不会共享属性
    function Parent(name){
        this.colors = [1,3,4];
        this.name = name;
    }
    function Child(name){
        Parent.call(this, name);
        this.age = 12;
    }
    // 存在的问题： 1.函数无法复用 2.父类的原型对于子类是不可见的

3.组合继承（使用原型链继承原型属性和方法，使用借用构造继承实例属性） ---最常用的继承模式
    缺点：无论如何都会调用两次父类构造函数
    // 父类
    function Parent(name){
        this.name = "xujaing";
        this.age = 12;
    };
    Parent.prototype.say = function() { console.log(this.age) };
    // 子类继承父类
    function Child(name){
        Parent.call(this, name);
        this.age = 13;
    }
    Child.prototype = new Parent();
    Child.prototype.constructor = Child;
    Child.prototype.say = function() { alert(this.age) };

4.原型式继承
    实现1.
        function object(o){
            function F(){};
            F.prototype = o;
            return new F()
        }
    实现2.通过Object.create(prototype, properties) // 第一个参数为创建新对象原型的对象，第二个参数为对新对象定义额外属性的对象（和defineProperties方法的第二个参数格式相同）
    Object.create(person, {
        name: {
            value: "xujiang"
        }
    })
5.寄生组合式继承（通过借用构造函数继承属性，通过原型链混成的方式继承方法）---最理想的继承范式
    function inheritPrototype(sub,sup){
        let prototype = Object.create(sup.prototype);
        prototype.constructor = sub;
        sub.prototype = prototype;
    }

    function Sup(){}
    Sup.prototype.say = function(){}
    function Sub(arg){
        // 关键
        Sup.call(this,arg);
    }
    // 关键
    inheritPrototype(Sub, Sup);
复制代码
```

# 七.函数表达式

### 闭包与变量

1. 闭包只能取得包含函数中任何变量的最后一个值

```
解决方案
    function createFunction(){
        let arr = [];
        for(let i=0; i< 10; i++){
            arr[i] = function(num){
                return function(){
                    return num
                }
            }(i)
        }
        return arr
    }
复制代码
```

### this对象

1. 在全局函数中，this等于window,而当函数被当作某个对象的方法调用时，this等于那个对象。不过，匿名函数的执行环境具有全局性，因此其this对象通常指向window
2. (object.say = object.say)() 此时函数内部this指向window,因为该赋值表达式的值是函数本身，所以this的值不能得到维持

### 内存泄漏

- 1.如果闭包的作用域链中保存着一个html元素，那就意味着该元素永远无法销毁。
- 2.闭包会引用包含函数的整个活动对象，而其中包含着html,因此有必要把其设置为null

```
function a(){
    let el = $("#el");
    let id = el.id;
    el.click(function(){
        alert(id)
    })
    // 清空dom,释放内存
    el = null;
}
复制代码
```

# 八.BOM对象

### 1.window

- BOM的核心对象是window,他表示浏览器的一个实例。
- 全局变量不能通过delete操作符删除,而直接定义在window对象上的属性可以删除

### 2.窗口位相关属性

窗口位置(不同浏览器实现不一样，所以位置获取的不精确和统一)

```
let leftPos = (typeof window.screenLeft == "number") ? window.screenLeft : window.screenX;
let top = (typeof window.screenTop == "number") ? window.screenTop : window.screenY;

// 获取页面视口
let pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
复制代码
```

### 3.系统对话框

```
// 显示打印对话框
window.print()
复制代码
```

### 4.location对象

```
// location即是window对象的属性也是document对象的属性
1. hash // "#contents" 返回url的hash,如果不包含返回空
2. host // "www.wrox.com:80" 返回服务器名称和和端口号
3. hostname // "www.wrox.com" 返回不带端口号的服务器名称
4. href // 返回当前加载页面的完整url
5. pathname // "/a/" 返回url中的目录或文件名
6. port // "8080" 返回url中指定的端口号
7. protocol // "http" 返回页面使用的协议
8. search // "?q=java" 返回url中查询字符串，以问号开头

// 获取查询字符串
function queryObj(){
    let qs = (location.search.length > 0 ? location.search.substring(1) : ''),
    arg = {},
    items = qs.length ? qs.split('&') : [],
    item = null,
    name = null,
    value = null,
    i = 0,
    len = items.length;

    for(i;i<len;i++){
        item = items[i].split('=');
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if(name.length){
            arg[name] = value;
        }
    }

    return args
}
// 位置操作
1.location.assign(url)  //打开新链接，并在浏览器历史记录里生成一条记录
2.location.href = url;  //打开新链接，并在浏览器历史记录里生成一条记录
3.location.hash = "#detail" // 在url后添加hash
4.location.hostname = "www.baidu.com" //修改服务器名称
5.location.pathname = "home" //修改路径
6.location.port = 8080; // 修改端口号
***通过以上方法修改url后会在浏览器历史中生成一条记录，用户点击后退可以导航到前一个页面。
7.location.replace(url) // 此方式不会在浏览器中生成新记录，用户不能回到前一个页面
8.location.reload([true]) // 页面会以最有效的方式重新加载（有可能从缓存中加载），如果参数为true，则将从服务器中加载
复制代码
```

### 5.navigator对象

```
navigator.language // "zh-CN" 浏览器的主语言
navigator.appName  // "Netscape" 完整的浏览器名称
navigator.appVersion // 浏览器的版本
// 5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36
navigator.cookieEnabled // true 表示cookie是否启用
navigator.javaEnabled() // 表示浏览器是否启用java
navigator.onLine // true 表示浏览器是否连接到了因特网
navigator.platform // "Win32" 浏览器所在的系统平台
navigator.userAgent // 浏览器用户代理字符串
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36"
navigator.plugins // 检测浏览器中安装的插件的数组
复制代码
```

### 6.history对象

```
1. history.go(0 | [123] | -1 | str) // 如果是Str,则会跳转到历史记录中包含该字符串的第一个位置
2. history.back() //后退一页
3. history.forward() //前进一页
4. history.length // 保存着历史纪录的数量
复制代码
```

# 九.客户端检查

### 1.检查用户代理

```
let client = function() {
    //呈现引擎
    let engine = {
        ie: 0,
        gecko: 0,
        webkit: 0,
        khtml: 0,
        opera: 0,
        // 完整版本号
        ver: null
    };
    // 浏览器
    let browser = {
        // 主要浏览器
        ie: 0,
        firefox: 0,
        safari: 0,
        konq: 0,
        opera: 0,
        chrome: 0,
        // 具体版本号
        ver: null
    };

    // 平台/设备/操作系统
    let system = {
        win: false,
        mac: false,
        x11: false,
        // 移动设备
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,
        // 游戏系统
        wii: false,
        ps: false
    };

    // 检测呈现引擎和浏览器
    let ua = navigator.userAgent;
    if (window.opera) {
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    } else if (/AppleWebKit\/(\S+)/.test(ua)) {
        // \S 匹配一个非空白字符
        engine.ver = RegExp["$1"];
        engine.webkit = parseFloat(engine.ver);
        // 确定是chrome还是safari
        if (/Chrome\/(\S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.chrome = parentFloat(browser.ver);
        } else if (/Version\/(\S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.safari = parentFloat(browser.ver);
        } else {
            //近似的确定版本号
            let safariVersion = 1;
            if (engine.webkit < 100) {
                let safariVersion = 1;
            } else if (engine.webkit < 312) {
              let safariVersion = 1.2;  
            } else if (engine.webkit < 412) {
              let safariVersion = 1.3;
            } else {
                let safariVersion = 2;
            }

            browser.safari = browser.ver = safariVersion;
        }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
        engine.ver = browser.ver = RegExp["$1"];
        engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
        engine.ver = RegExp["$1"];
        engine.gecko = parseFloat(engine.ver);

        // 确定是不是firefox
        if (/Firefox\/(\S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.firefox = parseFloat(browser.ver);
        }
    } else if (/MSIE ([^;]+)/.test(ua)) {
        engine.ver = browser.ver = RegExp["$1"];
        engine.ie = browser.ie = parseFloat(engine.ver);
    }

    // 检测浏览器
    browser.ie = engine.ie;
    browser.opera = engine.opera;

    // 检测平台
    let p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "x11") || (p.indexOf("Linux") == 0);

    // 检测window操作系统
    if (system.win) {
        if (/Win(?:dows)?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
            if (RegExp["$1"] == "NT") {
                switch(RegExp["$2"]) {
                    case "5.0":
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    case "6.1":
                        system.win = "7";
                        break;
                    default:
                        system.win = "NT";
                        break;
                }
            } else if (RegExp["$1"] == "9x") {
                system.win = "ME";
            } else {
                system.win = RegExp["$1"];
            }
        }
    }

    // 移动设备
    system.iphone = ua.indexOf("iPhone") > -1;
    system.ipod = ua.indexOf("iPod") > -1;
    system.ipad = ua.indexOf("ipad") > -1;
    system.nokiaN = ua.indexOf("NokiaN") > -1;

    // windows mobile
    if (system.win == "CE") {
        system.winMobile = system.win;
    } else if (system.win == "Ph") {
        if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
            system.win = "Phone";
            system.winMobile = parseFloat(RegExp["$1"]);
        }
    }

    // 检测ios版本
    if (system.mac && ua.indexOf("Mobile") > -1) {
        if (/CPU (?:iphone)?OS (/d+_\d+)/.test(ua)) {
            system.ios = parseFloat(RegExp.$1.replace("_", "."));
        } else {
            system.ios = 2;  //不能正确检测出来，只能猜测
        }
    }

    // 检测android
    if (/Android (\d+\.\d+)/.test(ua)) {
        system.android = parsentFloat(RegExp.$1);
    }

    // 游戏系统
    system.wii = ua.indexOf("Wii") > -1;
    system.ps = /playstation/i.test(ua);

    // 返回检测对象
    return {
        engine: engine,
        browser: browser,
        system: system
    }
}();
```

