## 背景

使用别人开源项目的时候，如果当你觉得有一些不足，或者发现一些 bug。的时候可以给别的开源项目 pull Request（以下简称 pr）

## 步骤

当你想更正别人仓库里的错误时，只需 3 步骤：

1. fork 别人的仓库
2. 开源i项目 clone 到本地分支，做一些修改
3. 发起 pull request 给原仓库

仅仅这几步整个 pull request 的过程就结束了。



已我 pr umi-request 实战为例 

## 操作

1. 进入 github 开源项目的地址，进行 fork

## 图一

> fork 之后该项目就会导入到自己的 github 仓库

![](https://raw.githubusercontent.com/zouxiaomingya/JavaScript/master/npm/img/one.jpg)

2. 进入自己的 github 主页 git clone umi-request 这个仓库。

![](https://raw.githubusercontent.com/zouxiaomingya/JavaScript/master/npm/img/two.jpg)


具体操作，打开控制台

```
$ git clone https://github.com/zouxiaomingya/umi-request.git
$ cd umi-request
// 拉出一个分支来修改 （也可以在主分支）
$ git checkout -b Interceptors-pr
// 做完 bug 的修改之后
$ git add .
$ git commit -m 'feat: add instance  Interceptors'
$ git push origin Interceptors-pr

```

3. 进行 pr 操作

> 进入自己仓库的 umi-request 的 pr 分支

![](https://raw.githubusercontent.com/zouxiaomingya/JavaScript/master/npm/img/three.jpg)


然后点击 Compare & pull request 按钮 进行提交

![](https://raw.githubusercontent.com/zouxiaomingya/JavaScript/master/npm/img/four.jpg)
