### webpack 的配置 

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const resolve = (...arg) => path.join(__dirname, ...arg);
module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    path: resolve('dist'),//定位，输出文件的目标路径
    filename: '[name].js' //文件名[name].js默认，也可自行配置
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    // // css 单独打包的插件
    // new MiniCssExtractPlugin({
    //   filename: "[name].css",
    //   chunkFilename: "[id].css"
    // })
  ],
  module: {
    rules:[
      {
        test: /\.(js|jsx)$/,
        use:[
          {
            loader:"babel-loader",
            options: {
              presets:[
                '@babel/preset-react',
                '@babel/preset-env',
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader'],
      },
      { 
        test: /\.less$/, 
        use: [
          'style-loader', {
          loader:'css-loader',
              // 开启 less 模块化
            options: {
              modules: true
            }
          }, 
          'less-loader'
        ]
      }
    ]
  },
  resolve: {
    // 设置别名
    alias: {
      '@': resolve('src'),
    },
    // 文件后缀补全
    extensions: ['.js', '.jsx'],
  },

}
```

###  antd 为了方便使用直接引入

> import antd from "antd/dist/antd.css"; 

### webpack 中使用 EChart 图

首先引入echarts 

> import echarts from 'echarts' 

使用如下

```react
import React, { useEffect, useRef } from 'react'
import echarts from 'echarts'
import option from './option'
import Styles from './index.less';
function Chart() {
  const chartDom = useRef(null)
  let myChart
  useEffect(() => {
      // 通过 echarts.init 注册一个实例
    myChart = echarts.init(chartDom.current)
      // 传入 option 配置实现图表
    myChart.setOption(option)
     // resize() 方法 改变 chart 的大小
    window.addEventListener('resize',myChart.resize)
      // 闭包的使用 来移除监听 组件卸载时候执行
    return () => {
      window.removeEventListener('resize',myChart.resize)
    }
  })
  return (
    <div ref={chartDom} className={Styles.chart} />
  )
}


export default Chart;
```

