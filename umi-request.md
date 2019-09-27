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

