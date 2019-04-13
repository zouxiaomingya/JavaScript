## Axios 源码解读

### Axios 是什么？

Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。 

### Axios 功能

- 从浏览器中创建 [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- 从 node.js 创建 [http](http://nodejs.org/api/http.html) 请求
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 XSRF

希望通过源码来慢慢理清这些功能的实现原理

### Axios 使用

执行 `GET` 请求

```javascript
axios.get('/user?ID=12345')
  .then(function (response) {
    console.log(response);
  })
```

执行 `POST` 请求 

```javascript
axios.post('/user', {
    name: 'zxm',
    age: 18,
  })
  .then(function (response) {
    console.log(response);
  })
```

使用方式不是本次主题的重点，具体使用方式可以参照 [Axios 中文说明](https://www.kancloud.cn/yunye/axios/234845)

> 源码拉下来直接进入 lib 开始解读源码
>

###  源码解读

> lib/axios.js 开始

```javascript
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

// 重点 createInstance 方法
// 先眼熟一个代码 下面讲完工具函数会再具体来讲解 createInstance
function createInstance(defaultConfig) {
    // 实例化 Axios
  var context = new Axios(defaultConfig);
    // 自定义 bind 方法 返回一个函数（）=> {Axios.prototype.request.apply(context,args)}
  var instance = bind(Axios.prototype.request, context);
    // Axios 源码的工具类 
  utils.extend(instance, Axios.prototype, context);
    
  utils.extend(instance, context);
    
  return instance;
}
// 传入一个默认配置   defaults 配置先不管，后面会有具体的细节
var axios = createInstance(defaults);


// 下面都是为 axios 实例化的对象增加不同的方法。
axios.Axios = Axios;
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');
module.exports = axios;
module.exports.default = axios;
```

> lib/util.js  工具方法

有如下方法：

```javascript
module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};
```

is开头的isXxx方法名 都是判断是否是 `Xxx`  类型 ，这里就不做明说 主要是看下 后面几个方法

> extend   将 b 里面的属性和方法继承给 a , 并且将 b 里面的方法的执行上个下文都绑定到 thisArg 


```javascript
// a, b，thisArg 参数都为一个对象
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
      // 如果指定了 thisArg 那么绑定执行上下文到 thisArg
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}
```
抽象的话看个例子

![1555136627494](C:\Users\zm\AppData\Local\Temp\1555136627494.png)

这样是不是就一目了然。fn2 函数没有拿自己对象内的 age = 20  而是被指定到了 thisArg 中的 age

> forEach 方法 遍历基本数据，数组，对象。

```javascript
function forEach(obj, fn) {
  if (obj === null || typeof obj === 'undefined') {
    return;
  }
  if (typeof obj !== 'object') {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
```
>  merge 合并对象的属性，相同属性后面的替换前的 

```javascript
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}
```
如下图所示：

![1555138065317](C:\Users\zm\AppData\Local\Temp\1555138065317.png)

> bind -> lib/ helpers/ bind.js  这个很清楚，返回一个函数，并且传入的方法执行上下文绑定到 thisArg上。

```javascript
module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};
```

好勒那么 axios/util 方法我们就基本没有问题拉

看完这些工具类方法后我们在回过头看之前的 createInstance 方法

```javascript
function createInstance(defaultConfig) {
    // 实例化 Axios， Axios下面会讲到
  var context = new Axios(defaultConfig);
    
    // 将 Axios.prototype.request 的执行上下文绑定到 context
    // bind 方法返回的是一个函数
  var instance = bind(Axios.prototype.request, context);
    
    // 将 Axios.prototype 上的所有方法的执行上下文绑定到 context , 并且继承给 instance
  utils.extend(instance, Axios.prototype, context);
    
    // 将 context 继承给 instance
  utils.extend(instance, context);
    
  return instance;
}
// 传入一个默认配置  
var axios = createInstance(defaults);
```

总结：`createInstance` 函数返回了一个函数 instance.

1. instance 是一个函数 Axios.prototype.request 且执行上下文绑定到 context。
2. instance 里面还有 Axios.prototype 上面的所有方法，并且这些方法的执行上下文也绑定到 context。
3. instance 里面还有 context 上的方法。

#### Axios 实例源码

```javascript
'use strict';
var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

// 核心方法 request 
Axios.prototype.request = function request(config) {
  // ... 单独讲
};

// 合并配置将用户的配置 和默认的配置合并
Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};
// 这个就是给 Axios.prototype 上面增加 delete,get,head,options 方法
// 这样我们就可以使用 axios.get(), axios.post() 等等方法
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  Axios.prototype[method] = function(url, config) {
     // 都是调用了 this.request 方法
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

```

上面的所以方法都是通过调用了 this.request 方法

那么我们就来看这个 request 方法，个人认为是源码内的精华也是比较难理解的部分，使用到了 Promise 的链式调用，也使用到了中间件的思想。

```javascript
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
Axios.prototype.request = function request(config) {
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }
    // 合并配置
  config = mergeConfig(this.defaults, config);
    // 请求方式，没有默认为 get
  config.method = config.method ? config.method.toLowerCase() : 'get';
    
    // 重点 这个就是拦截器的中间件
  var chain = [dispatchRequest, undefined];
    // 生成一个 promise 对象
  var promise = Promise.resolve(config);

    // 将请求前方法置入 chain 数组的前面 一次置入两个 成功的，失败的
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
	// 将请求后的方法置入 chain 数组的后面 一次置入两个 成功的，失败的
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

   // 通过 shift 方法把第一个元素从其中删除，并返回第一个元素。
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};
```

看到这里有点抽象，没关系。我们先讲下拦截器。在请求或响应被 `then` 或 `catch` 处理前拦截它们。使用方法参考 [Axios 中文说明](https://www.kancloud.cn/yunye/axios/234845) ，大致使用如下。

```javascript
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
```

通过 promise 链式调用一个一个函数，这个函数就是 chain 数组里面的方法

```javascript
// 初始的 chain 数组 dispatchRequest 是发送请求的方法
var chain = [dispatchRequest, undefined];

// 然后 遍历 interceptors 
// 注意 这里的 forEach 不是 Array.forEach， 也不是上面讲到的 util.forEach. 具体 拦截器源码 会讲到
// 现在我们只要理解他是遍历给 chain 里面追加两个方法就可以
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

```

然后添加了请求拦截器和相应拦截器 chain 会是什么样子呢 （重点）

```
chain = [ 请求拦截器的成功方法，请求拦截器的失败方法，dispatchRequest， undefined, 响应拦截器的成功方法，响应拦截器的失败方法 ]。
```

好了，知道具体使用使用之后是什么样子呢？回过头去看 request 方法

每次请求的时候我们有一个 

```javascript
 while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
   意思就是将 chainn 内的方法两两拿出来执行 成如下这样
    promise.then(请求拦截器的成功方法, 请求拦截器的失败方法)
           .then(dispatchRequest, undefined)
           .then(响应拦截器的成功方法, 响应拦截器的失败方法)
```

现在看是不是清楚了很多，拦截器的原理。现在我们再来看 InterceptorManager 的源码

#### InterceptorManager 拦截器源码 

> lib/ core/ InterceptorManager.js

```javascript
'use strict';
var utils = require('./../utils');

function InterceptorManager() {
    // 存放方法的数组
  this.handlers = [];
}
// 通过 use 方法来添加拦截方法
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};
// 通过 eject 方法来删除拦截方法
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
// 添加一个 forEach 方法，这就是上述说的 forEach
InterceptorManager.prototype.forEach = function forEach(fn) {
    // 里面还是依旧使用了 utils 的 forEach， 不要纠结这些 forEach 的具体代码
    // 明白他们干了什么就可以
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

```

#### dispatchRequest 源码

> lib/ core/ dispatchRequest .js

```javascript
'use strict';
var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
var combineURLs = require('./../helpers/combineURLs');
// 请求取消时候的方法，暂不看
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);
    // 请求没有取消 执行下面的请求
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }
  config.headers = config.headers || {};
	// 转换数据
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );
    // 合并配置
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );
  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );
    // 这里是重点， 获取请求的方式，下面会将到
  var adapter = config.adapter || defaults.adapter;
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
	// 难道了请求的数据， 转换 data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );
    return response;
  }, function onAdapterRejection(reason) {
      // 失败处理
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

```

看了这么多，我们还没看到是通过什么来发送请求的，现在我们看看在最开始实例化 createInstance 方法中我们传入的 `defaults` 是什么

`var axios = createInstance(defaults);`

> lib/ defaults.js

```javascript
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}
// getDefaultAdapter 方法是来获取请求的方式
function getDefaultAdapter() {
  var adapter;
  // process 是 node 环境的全局变量
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // 如果是 node 环境那么久通过 node http 的请求方法
    adapter = require('./adapters/http');
  } else if (typeof XMLHttpRequest !== 'undefined') {
   // 如果是浏览器啥的 有 XMLHttpRequest 的就用 XMLHttpRequest
    adapter = require('./adapters/xhr');
  }
  return adapter;
}

var defaults = {
    // adapter 就是请求的方法
  adapter: getDefaultAdapter(),
	// 下面一些请求头，转换数据，请求,详情的数据
    // 这也就是为什么我们可以直接拿到请求的数据时一个对象，如果用 ajax 我们拿到的都是 jSON 格式的字符串
    // 然后每次都通过 JSON.stringify（data）来处理结果。
  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

```

### 总结

1. Axios 的源码走读一遍确实可以看到和学习到很多的东西。
2. Axios 还有一些功能：请求的取消，请求超时的处理。这里我没有全部说明。
3. Axios 通过在请求中添加toke并验证方法，让客户端支持防御 XSRF [Django CSRF 原理分析](https://blog.csdn.net/u011715678/article/details/48752873)

 ### 最后

如果看的还不是很明白，不用担心，这基本上是我表达，书写的不够好。因为在写篇文章时我也曾反复的删除，重写，总觉得表达的不够清楚。不过你可以通过自己去 github 将代码拉下来对照着来看。

` git clone https://github.com/axios/axios.git`

> 全文章，如有错误或不严谨的地方，请务必给予指正，谢谢！ 

参考：

- [Axios 中文说明](https://www.kancloud.cn/yunye/axios/234845)
- [Axios 源码](https://github.com/axios/axios)
- [推荐 Axios源码深度剖析](https://juejin.im/post/5b0ba2d56fb9a00a1357a334)

