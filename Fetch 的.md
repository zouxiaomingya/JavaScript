### Fetch 的实例讲解
#### 简介

[Fetch API](https://link.jianshu.com/?t=https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 提供了一个 JavaScript接口，用于访问和操纵 HTTP 管道的部分，例如请求和响应。它还提供了一个全局 [fetch()](https://link.jianshu.com/?t=https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalFetch/fetch)方法，该方法提供了一种简单，合乎逻辑的方式来跨网络异步获取资源。

`fetch()` 必须接受一个参数---路径。无论请求成功与否，它都返回一个 Promise 对象，resolve 对应请求的 [`Response`](https://developer.mozilla.org/zh-CN/docs/Web/API/Response)。另外你还可以设置第二个参数（可选的参数）[options](#配置)（常用配置如下，具体详情参见 [`Request`](https://developer.mozilla.org/zh-CN/docs/Web/API/Request)）。

#### 配置

```js
options={
    // 请求方式 GET,POST,等
    method: "GET", 
    
    // 请求头headers   
    headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8', 
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
	},
	
    // omit: 从不发送cookies.
    // same-origin 只有当URL与响应脚本同源才发送 cookies
    // include 总是发送请求资源域在本地的 cookies 验证信息
    credentials: 'include'，
    
    //包含请求的模式 (例如： cors, no-cors, same-origin, navigate)
    //no-cors: 常用于跨域请求不带CORS响应头场景
    //cors表示同域和带有CORS响应头的跨域下可请求成功. 其他请求将被拒绝
    mode: 'cors'，
    
    //包含请求的缓存模式 (例如： default, reload, no-cache).具体参数见下面（cache参数）
    cache: 'default'
}
```

##### cache参数

> cache 表示如何处理缓存, 遵守 http 规范, 拥有如下几种值：

1. default: 浏览器从 HTTP 缓存中寻找匹配的请求.
2. no-store: 浏览器在不先查看缓存的情况下从远程服务器获取资源，并且不会使用下载的资源更新缓存
3. reload: 请求之前将忽略 http 缓存的存在, 但请求拿到响应后, 它将主动更新 http 缓存.
4. no-cache: 如果存在缓存, 那么 fetch 将发送一个条件查询 request 和一个正常的 request , 拿到响应后, 它会更新http缓存.
5. force-cache: 浏览器在其HTTP缓存中查找匹配的请求。
   - 如果存在匹配，*新鲜或过时*，则将从缓存中返回。
   - 如果没有匹配，浏览器将发出正常请求，并使用下载的资源更新缓存
6. only-if-cached: fetch 强行取缓存,（ 即使缓存过期了也从缓存取）. 如果没有缓存, 浏览器将返回错误

#### 案例

这是一个比较基本的案例，这里为了看的清楚，没有处理 catch 问题 。

```javascript
var url = 'https://zhidao.baidu.com/question/api/hotword?pn=1561&rn=5&t=1551165472017';
fetch(url).then(function(response) {
  return response;
}).then(function(data) {
  console.log(data);
})
```

可以自己动手把这个代码直接贴到控制台中 , 这里为了防止同源策略，并且看到更详细的数据我们最好在 https://zhidao.baidu.com 内的控制台中输入。如果在其他的页面我们应该在 fetch 方法的第二个参数中加上{ mode: "no-cors" }。为了看的更加清楚，我贴出这两种情况的打印结果，如下所示：

> 在 https://zhidao.baidu.com 网页控制台输入的地址


![](https://user-gold-cdn.xitu.io/2019/2/26/1692a36bfc844d2c?w=783&h=241&f=png&s=28256)

> 在其他网页控制台输入的地址


![](https://user-gold-cdn.xitu.io/2019/2/26/1692a3731963421a?w=704&h=226&f=png&s=21091)

我们会发现两个打印结果基本不同，首先跨域打印的结果中很多数据都是空的，另外我们也发现其中 type 也不相同，这里介绍下 response.type。

> fetch请求的响应类型( response.type )为如下三种之一：

- basic，同域下, 响应类型为 “basic”。
- cors，跨域下，返回 cors 响应头， 响应类型为 “cors”。
- opaque，跨域下, 服务器没有返回 cors 响应头， 响应类型为 “opaque”。


> `fetch`设了`{mode='no-cors'}`表示不垮域，可以请求成功，但拿不到服务器返回数据

看到这里，心急的同学会发现，其实现在数据还是没有拿到，我们仅仅只是拿到了个 Response 对象。那么如何拿到数据呢？

瞧好：

```javascript
var url = 'https://zhidao.baidu.com/question/api/hotword?pn=1561&rn=5&t=1551165472017';
fetch(url).then(function(response) {
  //通过 response 原型上的 json 方法拿到数据，在返回出去
  return response.json();
}).then(function(data) {
  // 接收到 data 打印出来
  console.log(data);
})
```

通过 response 原型上的 json 方法拿到数据，在返回出去。response 原型打印如下：



![](https://user-gold-cdn.xitu.io/2019/2/27/1692ed9655bd956d?w=814&h=545&f=png&s=54811)

这里要注意的是 response .json / response.text 方法只能使用一个并且只能使用一次，同时使用两个，或则使用两次都会报如下错误：

`Uncaught (in promise) TypeError: Failed to execute 'json' on 'Response': body stream is locked`

> 为什么不能使用两次？

数据流只能读取一次，一旦读取，数据流变空，再次读取会报错。可以使用 response.clone() 复制一个副本。

> 为什么只能读取一次？

答案还在查寻中，同时也希望知道的读者能够指点一下。

上面的写法，看起来有回调，又有链式调用，我们试着换个新写法，这里使用 async/await 来实现：

```javascript
var url = 'https://zhidao.baidu.com/question/api/hotword?pn=1&rn=5&t=1551191647420';
let getData = async () => {
    let response = await fetch(url);
    let data = response.json();
    console.log(data)
}
```

打印 data 如下：

![](https://user-gold-cdn.xitu.io/2019/2/26/1692a3aec5d3fddd?w=710&h=326&f=png&s=36589)
> 这里 data 是一个 Promise 对象，由于他的内部变量[[PromiseValue]]在外部无法得到，只能在 then 中获取，所以在后面加上 then 获取 data 

```javascript
let response = await fetch(url);
let data = response.json();
data.then((res)=>{
  console.log(res)
})
// 搞定 res 就是我们要的数据拉
```

#### 封装

> 我们通过 fetch 来做个简易的 request 封装，顺便把 options 再回顾一遍，很多配置在实际中可能是不需要的，都有默认配置（options 的默认配置在下面括号中）。

```javascript
function request(url, data = {}) {
  // options配置的默认选项在括号中
    return fetch(url, {
        method: "POST", //(GET), POST, PUT, DELETE, etc
        mode: "cors", // (same-origin), no-cors, cors
        cache: "no-cache", // (default), no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", //(same-origin), include, omit
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", //(follow), manual, error
        referrer: "no-referrer", //(client), no-referrer
        body: JSON.stringify(data), // 这里格式要与 "Content-Type" 同步
    })
    .then(response => response.json());
}
```

#### 最后

> ##### 初次写帖，如有错误或不严谨的地方，请务必给予指正，谢谢

参考：

- [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
- [传统 Ajax 已死，Fetch 永生](https://segmentfault.com/a/1190000003810652)