## 前言

1. 如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用。
2. 解决开发环境的跨域问题(不用在去配置nginx和host, 爽歪歪~~)

## 在`webpack.config.js`中配置

> 下面简单介绍一下五个经常使用的场景

### 使用一:

```
mmodule.exports = {
    //...
    devServer: {
        proxy: {
            '/api': 'http://localhost:3000'
        }
    }
};
```

请求到 `/api/xxx` 现在会被代理到请求 `http://localhost:3000/api/xxx`, 例如 `/api/user` 现在会被代理到请求 `http://localhost:3000/api/user`

### 使用二

如果你想要代码多个路径代理到同一个target下, 你可以使用由一个或多个「具有 context 属性的对象」构成的数组：

```
module.exports = {
    //...
    devServer: {
        proxy: [{
            context: ['/auth', '/api'],
            target: 'http://localhost:3000',
        }]
    }
};
```

### 使用三:

如果你不想始终传递 /api ，则需要重写路径：

```
module.exports = {
    //...
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                pathRewrite: {'^/api' : ''}
            }
        }
    }
};
```

请求到 /api/xxx 现在会被代理到请求 `http://localhost:3000/xxx`, 例如 /api/user 现在会被代理到请求 `http://localhost:3000/user`

### 使用四:

默认情况下，不接受运行在 HTTPS 上，且使用了无效证书的后端服务器。如果你想要接受，只要设置 `secure: false` 就行。修改配置如下：

```
module.exports = {
    //...
    devServer: {
        proxy: {
            '/api': {
                target: 'https://other-server.example.com',
                secure: false
            }
        }
    }
};
```

### 使用五:

有时你不想代理所有的请求。可以基于一个函数的返回值绕过代理。
 在函数中你可以访问请求体、响应体和代理选项。必须返回 false 或路径，来跳过代理请求。

例如：对于浏览器请求，你想要提供一个 HTML 页面，但是对于 API 请求则保持代理。你可以这样做：

```
module.exports = {
  //...
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                bypass: function(req, res, proxyOptions) {
                    if (req.headers.accept.indexOf('html') !== -1) {
                        console.log('Skipping proxy for browser request.');
                        return '/index.html';
                    }
                }
            }
        }
    }   
};
```

## 解决跨域原理

上面的参数列表中有一个`changeOrigin`参数, 是一个布尔值, 设置为true, 本地就会虚拟一个服务器接收你的请求并代你发送该请求,

```
module.exports = {
    //...
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    }
};
```

## vue-cli中proxyTable配置接口地址代理示例

修改 `config/index.js`

```
module.exports = {
    dev: {
    // 静态资源文件夹
    assetsSubDirectory: 'static',
    // 发布路径
    assetsPublicPath: '/',

    // 代理配置表，在这里可以配置特定的请求代理到对应的API接口
    // 使用方法：https://vuejs-templates.github.io/webpack/proxy.html
    proxyTable: {
        // 例如将'localhost:8080/api/xxx'代理到'https://wangyaxing.cn/api/xxx'
        '/api': {
            target: 'https://wangyaxing.cn', // 接口的域名
            secure: false,  // 如果是https接口，需要配置这个参数
            changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        },
        // 例如将'localhost:8080/img/xxx'代理到'https://cdn.wangyaxing.cn/xxx'
        '/img': {
            target: 'https://cdn.wangyaxing.cn', // 接口的域名
            secure: false,  // 如果是https接口，需要配置这个参数
            changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
            pathRewrite: {'^/img': ''}  // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
        }
    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 4200, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
}
```

## 更多参数

`dev-server` 使用了非常强大的 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) , `http-proxy-middleware` 基于 `http-proxy` 实现的，可以查看 http-proxy 的源码和文档:<https://github.com/nodejitsu/node-http-proxy> 。

```
target：要使用url模块解析的url字符串
forward：要使用url模块解析的url字符串
agent：要传递给http（s）.request的对象（请参阅Node的https代理和http代理对象）
ssl：要传递给https.createServer（）的对象
ws：true / false，是否代理websockets
xfwd：true / false，添加x-forward标头
secure：true / false，是否验证SSL Certs
toProxy：true / false，传递绝对URL作为路径（对代理代理很有用）
prependPath：true / false，默认值：true - 指定是否要将目标的路径添加到代理路径
ignorePath：true / false，默认值：false - 指定是否要忽略传入请求的代理路径（注意：如果需要，您必须附加/手动）。
localAddress：要为传出连接绑定的本地接口字符串
changeOrigin：true / false，默认值：false - 将主机标头的原点更改为目标URL
```
