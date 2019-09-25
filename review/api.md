## 多维数组 => 一维数组

```javascript
let ary = [1, [2, [3, [4, 5]]], 6];
let str = JSON.stringify(ary);
复制代码
//第0中处理:直接的调用
arr_flat = arr.flat(Infinity);
复制代码
//第一种处理
ary = str.replace(/(\[|\])/g, '').split(',');
复制代码
//第二种处理
str = str.replace(/(\[\]))/g, '');
str = '[' + str + ']';
ary = JSON.parse(str);
复制代码
//第三种处理：递归处理
let result = [];
let fn = function(ary) {
  for(let i = 0; i < ary.length; i++) }{
    let item = ary[i];
    if (Array.isArray(ary[i])){
      fn(item);
    } else {
      result.push(item);
    }
  }
}
复制代码
//第四种处理：用 reduce 实现数组的 flat 方法
function flatten(ary) {
    return ary.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
    }, []);
}
let ary = [1, 2, [3, 4], [5, [6, 7]]]
console.log(flatten(ary))
复制代码
//第五种处理：扩展运算符
while (ary.some(Array.isArray)) {
  ary = [].concat(...ary);
}
```