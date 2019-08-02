webpack4 的30个步骤打造优化到极致的 react 开发环境，如约而至
上一篇记录了一下webpack4使用的一些基础使用小技巧,确实没有想到能收获这么大的反响,还是非常感谢各位的错爱，没有看过的关于webpack4的14个知识点,童叟无欺

这一篇文章将react和webpack4进行结合,集webpack的优势于一身,从0开始构建一个强大的react开发环境

本篇所有代码线上代码react-webpack4-cook,翻译过来叫：webpack4和react的乱炖，可以跟着代码进行配置，之前有很多坑，线上代码都已经被解决了 。如果对您有帮助，不妨给个star.点赞关注不迷路

前言
一篇文章不写前言总感觉不太正式，大概介绍下我是怎么完成一个总的知识点的概括的把。其实很多人都有一看就会,一做就废的特点(当然也包括我在内),这个时候，你需要制定一个略微详细的计划，就比如我这篇会首先列出知识点，列出大的方向，制定思维导图，然后根据思维导图编写代码，计划明确，就会事半功倍，因此，希望你可以跟着本篇循序渐进的跟着代码走一遍，不管是真实开发，还是面试，都有的扯。好了，不扯了，可以先看下目录。现在开始

一、基础配置
1、init项目
mkdir react-webpack4-cook
cd react-webpack4-cook
mkdir src
mkdir dist
npm init -y
复制代码
2、安装webpack
yarn add webpack webpack-cli webpack-dev-server -D //webpack4把webpack拆分了
touch webpack.config.js
// webpack.config.js初始化内容
module.exports = {
    mode: "development",
    entry: ["./src/index.js"],
    output: {
        // 输出目录
        path: path.join(__dirname, "dist"),
        // 文件名称
        filename: "bundle.js"
    },
    module:{},
    plugins:[],
    devServer:{}
}
复制代码
3、安装react并编写代码
这部分代码篇幅过多，就是一些简单的react和react-router的一些代码编写，可以去github上查看，这里只阐述基本功能

cd src 
cnpm i react react-router-dom -S
// 建立如下的文件目录，并编写安装react和react-router并编写react代码如下
|-src
│      index.js 主文件
├───pages
│      Count.jsx -- 实现了一个计数器的功能，点击按钮，会让数字增加，按钮会实时显示在页面上
│      Home.jsx -- 一个简单的文字展示
└───router
       index.js -- 路由配置文件，两个页面分别对应两个路由 count和 home
复制代码
4、babel编译ES6,JSX等
// @babel/core-babel核心模块    @babel/preset-env-编译ES6等 @babel/preset-react-转换JSX
cnpm i babel-loader @babel/core @babel/preset-env  @babel/plugin-transform-runtime   @babel/preset-react -D
// @babel/plugin-transform-runtime: 避免 polyfill 污染全局变量，减小打包体积
// @babel/polyfill: ES6 内置方法和函数转化垫片
cnpm i @babel/polyfill @babel/runtime
 {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
 
复制代码
新建.babelrc文件

{
  "presets": ["@babel/preset-env","@babel/preset-react"],
  "plugins": ["@babel/plugin-transform-runtime"]
}
 
复制代码
5、按需引入polyfill
在src下的index.js中全局引入 @babel/polyfill 并写入 ES6 语法 ，但是这样有一个缺点：

全局引入 @babel/polyfill 的这种方式可能会导入代码中不需要的 polyfill，从而使打包体积更大
更改 .babelrc，只转译我们使用到的

npm install core-js@2 @babel/runtime-corejs2 -S
 
{
  "presets": ["@babel/preset-env",
              { "useBuiltIns": "usage" },
              "@babel/preset-react"],
  "plugins": ["@babel/plugin-transform-runtime"]
}
 
将将全局引入这段代码注释掉
// import '@babel/polyfill'
复制代码
这就配置好了按需引入。配置了按需引入 polyfill 后，用到es6以上的函数，babel会自动导入相关的polyfill，这样能大大减少 打包编译后的体积

5、插件 CleanWebpackPlugin
你经过多次打包后会发现，每次打包都会在dist目录下边生成一堆文件，但是上一次的打包的文件还在，我们需要每次打包时清除 dist 目录下旧版本文件

cnpm install  clean-webpack-plugin -D
// 注意这个引入的坑，最新版的需要这样引入，而不是直接const CleanWebpackPlugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 
plugins: [
    new CleanWebpackPlugin() 
]
复制代码
6、使用插件 HtmlWebpackPlugin
经过上一步的操作，index.html 也被清除了。因此我们将使用 HtmlWebpackPlugin插件，来生成 html， 并将每次打包的js自动插入到你的 index.html 里面去，而且它还可以基于你的某个 html 模板来创建最终的 index.html，也就是说可以指定模板哦

cnpm install html-webpack-plugin -D
// 创建template.html
cd src
touch template.html
 
// 内容如下
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>react-webpack4-cook</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
 
// webpack.config.js做出更改
const HtmlWebpackPlugin = require('html-webpack-plugin');
plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html', // 最终创建的文件名
      template: path.join(__dirname, 'src/template.html') // 指定模板路径
    })
  ]
复制代码
7、使用 source-map,对devtool进行优化
webpack中devtool选项用来控制是否生成，以及如何生成 source map。简言之，source map就是帮助我们定位到错误信息位置的文件。正确的配置source map，能够提高开发效率，更快的定位到错误位置。

在webpack.config.js中选项mode下加上如下这句话：

devtool:"cheap-module-eval-source-map",// 开发环境配置
devtool:"cheap-module-source-map",   // 线上生成配置
复制代码
8、使用 WebpackDevServer
webpack-dev-server就是在本地为搭建了一个小型的静态文件服务器，有实时重加载的功能，为将打包生成的资源提供了web服务

  devServer: {
    hot: true,
    contentBase: path.join(__dirname, "./dist"),
    host: "0.0.0.0", // 可以使用手机访问
    port: 8080,
    historyApiFallback: true, // 该选项的作用所有的404都连接到index.html
    proxy: {
      // 代理到后端的服务地址，会拦截所有以api开头的请求地址
      "/api": "http://localhost:3000"
    }
  }
复制代码
9、使用 HotModuleReplacement (热模块替换HMR)
建立了开发环境本地服务器 后，当修改内容后，网页会同步刷新，我们现在进入toCOunt页面

点击按钮，将数字加到一个不为0的数，比如加到6

然后你可以在代码中改变按钮的文字，随便改点东西，会发现，页面刷新后，数字重新变为0

这显然不是我们想要的，想要的是，能不能把页面的状态保存了，也就是更改了代码后，页面还是保存了数字为6的状态，也就是实现局部更改，首先需要用到：HotModuleReplacementPlugin插件

devServer: {
    hot: true
},
 
plugins: [
    new webpack.HotModuleReplacementPlugin()
],
复制代码
完事之后，继续更上边的操作，点击按钮，数字增加，然后更改内容，发现还是没有保存状态。。。what？怎么办

对@！这还没完呢，接着往下看，我们还需要react-hot-loader这个插件

10、react-hot-loader记录react页面留存状态state
我们继续接着上边的进行操作，分一下四步

cnpm i react-hot-loader -D
 
// 在主文件里这样写
 
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";-------------------1、首先引入AppContainre
import { BrowserRouter } from "react-router-dom";
import Router from "./router";
 
/*初始化*/
renderWithHotReload(Router);-------------------2、初始化
 
/*热更新*/
if (module.hot) {-------------------3、热更新操作
  module.hot.accept("./router/index.js", () => {
    const Router = require("./router/index.js").default;
    renderWithHotReload(Router);
  });
}
 
 
function renderWithHotReload(Router) {-------------------4、定义渲染函数
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AppContainer>,
    document.getElementById("app")
  );
}
 
复制代码
好了，现在你再试试

11、编译css和scss
cnpm install css-loader style-loader sass-loader node-sass -D
 
{
  test: /\.scss$/,
    use: [
      "style-loader", // 创建style标签，并将css添加进去
      "css-loader", // 编译css
      "sass-loader" // 编译scss
    ]
}
复制代码
12、集成postcss
最关心的还是这有啥用啊？自动增加前缀， postcss-cssnext允许你使用未来的css特性，并做一些兼容处理

cnpm install  postcss-loader postcss-cssnext -D
 
{
    test: /\.scss$/,
        use: [
            "style-loader", // 创建style标签，并将css添加进去
            "css-loader", // 编译css
            "postcss-loader",
            "sass-loader" // 编译scss
        ]
}
// 在刚才的home.scss 加上 transform: scale(2);
通过控制台查看，已经自动加上了前缀
复制代码
13、处理图片
cnpm i file-loader url-loader -D
 
file-loader 解决css等文件中引入图片路径的问题
url-loader 当图片较小的时候会把图片BASE64编码，大于limit参数的时候还是使用file-loader 进行拷贝
{
    test: /\.(png|jpg|jpeg|gif|svg)/,
    use: {
      loader: 'url-loader',
      options: {
        outputPath: 'images/', // 图片输出的路径
        limit: 10 * 1024
      }
    }
}
复制代码
14、处理字体
{
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
              publicPath: 'fonts/',
              outputPath: 'fonts/'
            }
          }
        ]
      }
复制代码
二、webpack优化
1、alias对文件路径优化
extension: 指定extension之后可以不用在require或是import的时候加文件扩展名,会依次尝试添加扩展名进行匹配
alias: 配置别名可以加快webpack查找模块的速度
  resolve: {
    extension: ["", ".js", ".jsx"],
    alias: {
      "@": path.join(__dirname, "src"),
      pages: path.join(__dirname, "src/pages"),
      router: path.join(__dirname, "src/router")
    }
  },
复制代码
14、使用静态资源路径publicPath(CDN)
CDN通过将资源部署到世界各地，使得用户可以就近访问资源，加快访问速度。要接入CDN，需要把网页的静态资源上传到CDN服务上，在访问这些资源时，使用CDN服务提供的URL。

output:{
 publicPatch: '//【cdn】.com', //指定存放JS文件的CDN地址
}
复制代码
2、MiniCssExtractPlugin ，抽取 css 文件
如果不做配置，我们的css是直接打包进js里面的，我们希望能单独生成css文件。 因为单独生成css,css可以和js并行下载，提高页面加载效率

cnpm install mini-css-extract-plugin -D
 
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
 
 {
        test: /\.scss$/,
        use: [
          // "style-loader", // b不再需要style-loader要已经分离处理
          MiniCssExtractPlugin.loader,
          "css-loader", // 编译css
          "postcss-loader",
          "sass-loader" // 编译scss
        ]
      },
 
 plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
复制代码
3、代码分割按需加载、提取公共代码
为什么要实现按需加载？

我们现在看到，打包完后，所有页面只生成了一个bundle.js,当我们首屏加载的时候，就会很慢。因为他也下载了别的页面的js了,也就是说，执行完毕之前，页面是 完！全！空！白！的！。 如果每个页面单独打包自己的js，就可以在进入页面时候再加载自己 的js，首屏加载就可以快很多

  optimization: {
    splitChunks: {
      chunks: "all", // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
    },
  },
复制代码
5、文件压缩
webpack4只要在生产模式下， 代码就会自动压缩

mode:productioin
复制代码
6、暴露全局变量
可以直接在全局使用$变量

 new webpack.ProvidePlugin({
      $: 'jquery', // npm
      jQuery: 'jQuery' // 本地Js文件
    })
复制代码
8、指定环境,定义环境变量
plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        VUEP_BASE_URL: JSON.stringify('http://localhost:9000')
      }
    }),
]
复制代码
9、css Tree Shaking
npm i glob-all purify-css purifycss-webpack --save-dev
 
const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')
plugins:[
    // 清除无用 css
    new PurifyCSS({
      paths: glob.sync([
        // 要做 CSS Tree Shaking 的路径文件
        path.resolve(__dirname, './src/*.html'), // 请注意，我们同样需要对 html 文件进行 tree shaking
        path.resolve(__dirname, './src/*.js')
      ])
    })
]
复制代码
10、js Tree Shaking
清除到代码中无用的js代码，只支持import方式引入，不支持commonjs的方式引入

只要mode是production就会生效，develpoment的tree shaking是不生效的，因为webpack为了方便你的调试

  optimization: {
    usedExports:true,
  }
复制代码
11、DllPlugin插件打包第三方类库
项目中引入了很多第三方库，这些库在很长的一段时间内，基本不会更新，打包的时候分开打包来提升打包速度，而DllPlugin动态链接库插件，其原理就是把网页依赖的基础模块抽离出来打包到dll文件中，当需要导入的模块存在于某个dll中时，这个模块不再被打包，而是去dll中获取。

安装jquery，并在入口文件引入。新建webpack.dll.config.js文件

/*
* @desc 静态公共资源打包配置
*/


const path = require('path')
const webpack = require('webpack')

const src = path.resolve(process.cwd(), 'src'); // 源码目录
const evn = process.env.NODE_ENV == "production" ? "production" : "development";

module.exports = {
    mode: 'production',
    entry: {
        // 定义程序中打包公共文件的入口文件vendor.js
        jquery: ['jquery']
    },

    output: {
        path: path.resolve(__dirname, '..', 'dll'),
        filename: '[name].dll.js',
        library: '[name]_[hash]',
        libraryTarget: 'this'
    },

    plugins: [
        new webpack.DllPlugin({
            // 定义程序中打包公共文件的入口文件vendor.js
            context: process.cwd(),

            // manifest.json文件的输出位置
            path: path.resolve(__dirname, '..', 'dll/[name]-manifest.json'),

            // 定义打包的公共vendor文件对外暴露的函数名
            name: '[name]_[hash]'
        })
    ]
}
复制代码
在package.json中添加

        "build:dll": "webpack --config ./build/webpack.dll.config.js",
复制代码
运行

npm run build:dll
复制代码
你会发现多了一个dll文件夹，里边有dll.js文件，这样我们就把我们的jquery这些已经单独打包了，接下来怎么使用呢？

需要再安装一个依赖 npm i add-asset-html-webpack-plugin，它会将我们打包后的 dll.js 文件注入到我们生成的 index.html 中.在 webpack.base.config.js 文件中进行更改。

 new AddAssetHtmlWebpackPlugin({
 filepath: path.resolve(__dirname, '../dll/jquery.dll.js') // 对应的 dll 文件路径
 }),
 new webpack.DllReferencePlugin({
 manifest: path.resolve(__dirname, '..', 'dll/jquery-manifest.json')
 })
复制代码
好了，你可有吧new webpack.DllReferencePlugin这个插件注释掉，打包试下，在放开打包试一下，我测试结果，注释钱5689，注释后，5302ms，才差了300ms?注意，我这里只有一个jquery包作为演示，要是你把很多个都抽离了出来呢？？？那岂不是很恐怖了。如果你看的有点迷迷糊糊，那推荐去线上看一下我的代码吧，一看便知

12、使用happypack并发执行任务
运行在 Node.之上的Webpack是单线程模型的，也就是说Webpack需要一个一个地处理任务，不能同时处理多个任务。 Happy Pack 就能让Webpack做到这一点，它将任务分解给多个子进程去并发执行，子进程处理完后再将结果发送给主进程。

cnpm i -D happypack
 
// webpack.config.js
 rules: [
     {
        // cnpm i babel-loader @babel/core @babel/preset-env -D
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            // 一个loader对应一个id
            loader: "happypack/loader?id=busongBabel"
          }
        ]
      }
      ]
 
//在plugins中增加
plugins:[
      new HappyPack({
      // 用唯一的标识符id，来代表当前的HappyPack是用来处理一类特定的文件
      id:'busongBabel',
      // 如何处理.js文件，用法和Loader配置中一样
      loaders:['babel-loader?cacheDirectory'],
      threadPool: HappyPackThreadPool,
  })
]
 
复制代码
13、PWA优化策略
简言之：在你第一次访问一个网站的时候，如果成功，做一个缓存，当服务器挂了之后，你依然能够访问这个网页 ，这就是PWA。那相信你也已经知道了，这个只需要在生产环境，才需要做PWA的处理，以防不测。

 cnpm i workbox-webpack-plugin -D

const WorkboxPlugin = require('workbox-webpack-plugin') // 引入 PWA 插件
const prodConfig = {
  plugins: [
    // 配置 PWA
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ]
}

在入口文件加上
// 判断该浏览器支不支持 serviceWorker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('service-worker registed')
      })
      .catch(error => {
        console.log('service-worker registed error')
      })
  })
}
复制代码
配置完后，你可以打包到dist目录下，在dist目录下启动一个静态服务器，访问首页，然后关闭这个服务器，你会惊讶的发现：网站竟然还能够访问，哈哈，是不是很神奇？

15、合并提取webpack公共配置
 开发环境与生产环境以及webpack配置文件的分离，具体需要用到webpack-merge，用来 合并 webpack配置
复制代码
16、最终分离配置文件（打完收工）
由于时间和篇幅的限制，基本到这里就结束了。以上，不管是提到的未提到的，或者还有一些细枝末节，github上的源码基本都已经全部包括在内了，如果有需要可以去github参照配置文件，自己跟着配一份出来，会更加事半功倍


[webpack4 的30个步骤打造优化到极致的 react 开发环境](https://juejin.im/post/5cfe4b13f265da1bb13f26a8) 