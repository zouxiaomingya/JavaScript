## 1. 背景

node 应用开发中，我们不可避免的需要使用或拆分为 npm 模块，经常遇到的一个问题是：

> 新开发或修改的 npm 模块，如何在项目中试验？

新同学一般会有以下几种方式：

为了方便示范，我们假设项目是 `my-project`, 需要用到一个独立的 `my-utils` 模块

### 1.1 发布一个 beta 版本

- 优点：你高兴就好。
- **缺点：** 无趣+无趣+无趣，麻烦+麻烦+麻烦。

### 1.2 直接用相对路径安装

```
$ cd path/to/my-project
$ npm install path/to/my-utils
```

- 优点：简单明了
- **缺点：** 调试过程中往往需要微调，此时需要切换到 my-utils 目录修改，然后反复重新 install，很麻烦

### 1.3 使用软链

```
$ cd path/to/my-project/node_modules
$ ln -s path/to/my-utils my-utils
```

- 优点：软链后，两边修改直接同步
- **缺点：** 指令操作麻烦，不同操作系统语法不一样

## 2. 正解 - npm link

但其实 npm 本身已经对此类情况提供了专门的 `npm link` 指令。

相关文档： <https://docs.npmjs.com/cli/link>

下面我们简单介绍下用法：

```
$ cd path/to/my-project
$ npm link path/to/my-utils
```

简单的替换一个单词，就搞定了，cool~

如果这两种的目录不在一起，那还有一种方法：

```
$ # 先去到模块目录，把它 link 到全局
$ cd path/to/my-utils
$ npm link
$
$ # 再去项目目录通过包名来 link
$ cd path/to/my-project
$ npm link my-utils
```

该指令还可以用来调试 node cli 模块，譬如需要本地调试我们的 [egg-init](https://github.com/eggjs/egg-init)，可以这样：

```
$ cd path/to/egg-init
$ npm link
$ # 此时全局的 egg-init 指令就已经指向你的本地开发目录了
$ egg-init # 即可
```

想去掉 link 也很简单：

```
$ npm unlink my-utils
```

## 3. 写在最后

- 该方法只是为了最后一步调试，模块本身的正确性，应该更多的通过单元测试来保证。
- 单元测试相关内容，可以参见：[单元测试](https://eggjs.org/zh-cn/core/unittest.html)