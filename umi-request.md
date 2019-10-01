## 剖析 umi-request

> 最近业务繁忙，很久没有沉淀一些知识了，趁着今天下班的早，来学习学习 umi 的请求层 umi-request

[umi-request](https://github.com/umijs/umi-request)

> 代码拉下来之后, 直接进入主题

```javaScript
// src/index.js
import request, { extend, fetch } from './request';
import Onion from './onion';
import { RequestError, ResponseError } from './utils';

export { extend, RequestError, ResponseError, Onion, fetch };
export default request;

```
index 文件很清楚 分别引用了 3 个文件夹
1. request
2. onion
3. utils

### index.js 文件

```javaScript
const request = (initOptions = {}) => {
  const coreInstance = new Core(initOptions);
  const umiInstance = (url, options = {}) => {
    const mergeOptions = {
      ...initOptions,
      ...options,
      headers: {
        ...initOptions.headers,
        ...options.headers,
      },
      params: {
        ...initOptions.params,
        ...options.params,
      },
      method: (options.method || initOptions.method || 'get').toLowerCase(),
    };
    return coreInstance.request(url, mergeOptions);
  };
  // 省略一些代码 ....
  return umiInstance;
};
```

> request 构造函数中 关键的是 Core 这个方法。


### Core.js 文件

```javaScript
  request(url, options) {
    const { onion } = this;
    const obj = {
      req: { url, options },
      res: null,
      cache: this.mapCache,
      responseInterceptors,
    };
    if (typeof url !== 'string') {
      throw new Error('url MUST be a string');
    }

    return new Promise((resolve, reject) => {
      // dealRequestInterceptors 是请求拦截器
      Core.dealRequestInterceptors(obj)
        .then(() => onion.execute(obj))
        .then(() => {
          resolve(obj.res);
        })
        .catch(error => {
          const { errorHandler } = obj.req.options;
          if (errorHandler) {
            try {
              const data = errorHandler(error);
              resolve(data);
            } catch (e) {
              reject(e);
            }
          } else {
            reject(error);
          }
        });
    });
  }
}
};
```


## 快速上手

执行 **GET** 请求

```javascript
import request from 'umi-request';

request.get('/api/v1/xxx?id=1')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

// 也可将 URL 的参数放到 options.params 里
request.get('/api/v1/xxx', {
    params: {
      id: 1
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

执行 **POST** 请求

```
request.post('/api/v1/user', {
    data: {
      name: 'Mike'
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

## umi-request API

可以通过向 **umi-request** 传参来发起请求

**umi-request(url[, options])**

```javascript
import request from 'umi-request';

request('/api/v1/xxx', {
    method: 'get',
    params: { id: 1 }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

request('/api/v1/user', {
    method: 'post',
    data: {
      name: 'Mike'
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

## 请求方法的别名

为了方便起见，为所有支持的请求方法提供了别名, `method` 属性不必在配置中指定

**request.get(url[, options])**

**request.post(url[, options])**

**request.delete(url[, options])**

**request.put(url[, options])**

**request.patch(url[, options])**

**request.head(url[, options])**

**request.options(url[, options])**

## 创建实例

有些通用的配置我们不想每个请求里都去添加，那么可以通过 `extend` 新建一个 umi-request 实例

**extend([options])**

```javascript
import { extend } from 'umi-request';

const request = extend({
  prefix: '/api/v1',
  timeout: 1000,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

request.get('/user')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

NodeJS 环境创建实例

```javascript
const umi = require('umi-request');
const extendRequest = umi.extend({ timeout: 10000 })

extendRequest('/api/user')
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```

以下是可用的实例方法，指定的配置将与实例的配置合并。

**request.get(url[, options])**

**request.post(url[, options])**

**request.delete(url[, options])**

**request.put(url[, options])**

**request.patch(url[, options])**

**request.head(url[, options])**

**request.options(url[, options])**