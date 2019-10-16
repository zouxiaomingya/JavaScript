## jest使用

- [Jest](https://link.juejin.im?target=https%3A%2F%2Fjestjs.io%2F) 是由 Facebook 开源出来的一个测试框架，它集成了断言库、mock、快照测试、覆盖率报告等功能。它非常适合用来测试 React 代码，但不仅仅如此，所有的 js 代码都可以使用 Jest 进行测试。

  本文全面的介绍如何使用 Jest，让后来者轻松上手。文中会选取重点部分直接贴出代码，比较简单的部分则不会，主要是写到后面的时候发现贴的代码有点多，没什么意思，所有的代码已上传到 [Github](https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2Fhezhii%2Fjest-demos)，可以自行查阅。

  ## 安装

  使用 `yarn` 安装 Jest:

  ```
  $ yarn add --dev jest
  复制代码
  ```

  或使用 `npm`：

  ```
  $ npm i -D jest
  复制代码
  ```

  其中 `--dev` 和 `-D` 参数指明作为 **devDependencies**，这样该依赖只会在开发环境下安装，在生成环境下则不会。

  在 `package.json` 文件中添加下面的内容：

  ```
  "scripts": {
    "test": "jest"
  }
  复制代码
  ```

  这样我们就可以通过 `yarn test` 或 `npm test` 执行测试代码。

  同样地，你也可以选择全局安装 Jest：

  ```
  $ yarn global add jest
  $ # or npm i -g jest
  复制代码
  ```

  这样你就可以直接在命令行使用 `jest` 命令。如果你是本地安装，但是也想在命令行使用 `jest`，可以通过 `node_modules/.bin/webpack` 访问它的 bin 版本，如果你的 npm 版本在 **5.2.0** 以上，你也可以通过 `npx jest` 访问。

  ### 使用 Babel

  如果你在代码中使用了新的语法特性，而当前 Node 版本不支持，则需要使用 Babel 进行转义。

  ```
  $ npm i -D babel-jest babel-core babel-preset-env
  复制代码
  ```

  > 注意：如果你使用 **babel 7**，安装 **babel-jest** 的同时还需要安装其他依赖： `npm i -D babel-jest 'babel-core@^7.0.0-0' @babel/core`

  Jest 默认使用 babel-jest（需要安装） 进行代码转义，如果你需要添加额外的预处理器，则需要在 Jest 配置文件中**显示的定义 babel-jest 作为 JavaScript 处理器**（因为一旦添加了 transform 配置，babel-jest 就不会自动载入了）：

  ```
  "transform": {
    "^.+\\.jsx?$": "babel-jest"
  },
  复制代码
  ```

  我们还需在根目录下创建 `.babelrc` 文件：

  ```
  {
    "presets": [
      "env"
    ]
  }
  复制代码
  ```

  我这里只使用了 **babel-preset-env** 预设，如果需要其他的转换，见 [babel](https://link.juejin.im?target=https%3A%2F%2Fbabeljs.io%2F)。

  ## 基本用法

  我们从一个基本的 Math 模块开始。首先创建一个 `math.js` 文件：

  ```
  // basic/math.js
  
  const sum = (a, b) => a + b
  const mul = (a, b) => a * b
  const sub = (a, b) => a - b
  const div = (a, b) => a / b
  
  export { sum, mul, sub, div }
  复制代码
  ```

  要测试这个 Math 模块是否正确，我们需要编写测试代码。通常，测试文件与所要测试的源码文件同名，但是后缀名为 `.test.js` 或者 `.spec.js`。我们这里则创建一个 `math.test.js` 文件：

  ```
  // basic/math.test.js
  
  import { sum, mul, sub, div } from './math'
  
  test('Adding 1 + 1 equals 2', () => {
    expect(sum(1, 1)).toBe(2)
  })
  
  test('Multiplying 1 * 1 equals 1', () => {
    expect(mul(1, 1)).toBe(1)
  })
  
  test('Subtracting 1 - 1 equals 0', () => {
    expect(sub(1, 1)).toBe(0)
  })
  
  test('Dividing 1 / 1 equals 1', () => {
    expect(div(1, 1)).toBe(1)
  })
  复制代码
  ```

  执行 `npm test` Jest 将会执行所有匹配的测试文件，并最终返回测试结果：

  

  ![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="570" height="268"></svg>)

  

  ## 在编辑器中运行

  很多编辑器都能支持 Jest，如：Webstorm、VS Code、Atom 等。这里简单地介绍下如何在 Webstorm 和 VS Code 中运行。

  ### Webstorm

  Webstorm 可能出现找不到变量等问题，在 `Preferences | Languages & Frameworks | JavaScript | Libraries` 中点击 `Download`, 然后选择 **Jest** 并下载即可。

  Webstorm 可以识别测试代码，在编辑器中点击“相应的运行按钮”即可运行，或使用快捷键 `ctrl+shift+R`（mac 中）。具体的操作可以参考我之前写的 [Node.js 中 使用 Mocha 进行单元测试](https://link.juejin.im?target=https%3A%2F%2Fblog.whezh.com%2Fnodejs-unit%2F)的博客。

  ### VS Code

  要想在 VS Code 中运行，我们需要安装 [Jest 插件](https://link.juejin.im?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3DOrta.vscode-jest)。

  插件安装完成后，如果你安装了 Jest，它会自动的运行测试代码。你可以可以手动的运行通过 **Jest: Start Runner** 命令，它会执行测试代码并在文件发生修改后重新运行。

  

  ![img](https://user-gold-cdn.xitu.io/2018/9/24/1660b0ab88c13fc0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

  

  ## 匹配器

  匹配器用来实现断言功能。在前面的例子中，我们只使用了 `toBe()` 匹配器：

  ```
  test('Adding 1 + 1 equals 2', () => {
    expect(sum(1, 1)).toBe(2)
  })
  复制代码
  ```

  在此代码中，`expect(sum(1, 1))` 返回一个“期望”对象，`.toBe(2)` 是匹配器。匹配器将 `expect()` 的结果（**实际值**）与自己的参数（**期望值**）进行比较。当 Jest 运行时，它会跟踪所有失败的匹配器，并打印出错误信息。

  常用的匹配器如下：

  - `toBe` 使用 [Object.is](https://link.juejin.im?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2Fis) 判断是否严格相等。
  - `toEqual` 递归检查对象或数组的每个字段。
  - `toBeNull` 只匹配 `null`。
  - `toBeUndefined` 只匹配 `undefined`。
  - `toBeDefined` 只匹配非 `undefined`。
  - `toBeTruthy` 只匹配真。
  - `toBeFalsy` 只匹配假。
  - `toBeGreaterThan` 实际值大于期望。
  - `toBeGreaterThanOrEqual` 实际值大于或等于期望值
  - `toBeLessThan` 实际值小于期望值。
  - `toBeLessThanOrEqual` 实际值小于或等于期望值。
  - `toBeCloseTo` 比较浮点数的值，避免误差。
  - `toMatch` 正则匹配。
  - `toContain` 判断数组中是否包含指定项。
  - `.toHaveProperty(keyPath, value)` 判断对象中是否包含指定属性。
  - `toThrow` 判断是否抛出指定的异常。
  - `toBeInstanceOf` 判断对象是否是某个类的实例，底层使用 `instanceof`。

  所有的匹配器都可以使用 `.not` 取反：

  ```
  test('Adding 1 + 1 does not equal 3', () => {
    expect(1 + 1).not.toBe(3)
  })
  复制代码
  ```

  对于 Promise 对象，我们可以使用 `.resolves` 和 `.rejects`：

  ```
  // .resolves
  test('resolves to lemon', () => {
    // make sure to add a return statement
    return expect(Promise.resolve('lemon')).resolves.toBe('lemon')
  })
  
  // .rejects
  test('rejects to octopus', () => {
    // make sure to add a return statement
    return expect(Promise.reject(new Error('octopus'))).rejects.toThrow(
      'octopus',
    )
  })
  复制代码
  ```

  ## 异步测试

  JavaScript 代码中常常会包含异步代码，当测试异步代码时，Jest 需要知道什么时候异步代码执行完成，在异步代码执行完之前，它会去执行其他的测试代码。Jest 提供了多种方式测试异步代码。

  ### 回调函数

  当执行到测试代码的尾部时，Jest 即认为测试完成。因此，如果存在异步代码，Jest 不会等待回调函数执行。要解决这个问题，在测试函数中我们接受一个参数叫做 `done`，Jest 将会一直等待，直到我们调用 `done()`。如果一直不调用 `done()`，则此测试不通过。

  ```
  // async/fetch.js
  export const fetchApple = (callback) => {
    setTimeout(() => callback('apple'), 300)
  }
  
  // async/fetch.test.js
  import { fetchApple } from './fetch'
  
  test('the data is apple', (done) => {
    expect.assertions(1)
    const callback = data => {
      expect(data).toBe('apple')
      done()
    }
  
    fetchApple(callback)
  })
  复制代码
  ```

  `expect.assertions(1)` 验证当前测试中有 1 处断言会被执行，在测试异步代码时，能确保回调中的断言被执行。

  ### Promise

  如果异步代码返回 Promise 对象，那我们在测试代码直接返回该 Promise 即可，Jest 会等待其 resolved，如果 rejected 则测试不通过。

  ```
  test('the data is banana', () => {
    expect.assertions(1)
    return fetchBanana().then(data => expect(data).toBe('banana'))
  })
  复制代码
  ```

  如果期望 promise 是 rejected 状态，可以使用 `.catch()`：

  ```
  test('the fetch fails with an error', () => {
    expect.assertions(1)
    return fetchError().catch(e => expect(e).toMatch('error'))
  })
  复制代码
  ```

  除此之外，还可以使用上文中提到的 `.resolves` 和 `.rejects`。

  ### Async/Await

  如果异步代码返回 promise，我们还可以使用 async/await：

  ```
  test('async: the data is banana', async () => {
    expect.assertions(1)
    const data = await fetchBanana()
    expect(data).toBe('banana')
  })
  
  test('async: the fetch fails with an error', async () => {
    expect.assertions(1)
    try {
      await fetchError()
    } catch (e) {
      expect(e).toMatch('error')
    }
  })
  复制代码
  ```

  也可以将 aysnc/awiat 与 `.resolves` 或 `.rejects` 结合：

  ```
  test('combine async with `.resolves`', async () => {
    expect.assertions(1)
    await expect(fetchBanana()).resolves.toBe('banana')
  })
  复制代码
  ```

  ## 钩子函数

  Jest 为我们提供了四个测试用例的钩子：`beforeAll()`、`afterAll()`、`beforeEach()`、`afterEach()`。

  `beforeAll()` 和 `afterAll()` 会在**所有测试用例**之前和所有测试用例之后执行**一次**。 `beforeEach()` 和 `afterEach()` 会在每个测试用例之前和之后执行。

  ### 分组

  我们可以使用 `describe` 将测试用例分组，在 `describe` 块中的钩子函数只作用于块内的测试用例：

  ```
  beforeAll(() => console.log('1 - beforeAll')) // 1
  afterAll(() => console.log('1 - afterAll')) // 12
  beforeEach(() => console.log('1 - beforeEach')) // 2,6
  afterEach(() => console.log('1 - afterEach')) // 4,10
  test('', () => console.log('1 - test')) // 3
  describe('Scoped / Nested block', () => {
    beforeAll(() => console.log('2 - beforeAll')) // 5
    afterAll(() => console.log('2 - afterAll')) // 11
    beforeEach(() => console.log('2 - beforeEach')) // 7
    afterEach(() => console.log('2 - afterEach')) // 9
    test('', () => console.log('2 - test')) // 8
  })
  复制代码
  ```

  需要注意的是，顶级的 `beforeEach` 会在 `describe` 块内的 `beforeEach` 之前执行。

  Jest 会先执行 `describe` 块内的操作，等 `describe` 块内的操作执行完毕后，按照出现在 `describe` 中的先后顺序执行测试用例，因此初始化和销毁操作应该放在钩子函数中运行，而不是 `describe` 块内：

  ```
  describe('outer', () => {
    console.log('describe outer-a') // 1
  
    describe('describe inner 1', () => {
      console.log('describe inner 1') // 2
      test('test 1', () => {
        console.log('test for describe inner 1') // 6
        expect(true).toEqual(true)
      })
    })
  
    console.log('describe outer-b') // 3
  
    test('test 1', () => {
      console.log('test for describe outer') // 7
      expect(true).toEqual(true)
    })
  
    describe('describe inner 2', () => {
      console.log('describe inner 2') // 4
      test('test for describe inner 2', () => {
        console.log('test for describe inner 2') // 8
        expect(false).toEqual(false)
      })
    })
  
    console.log('describe outer-c') // 5
  })
  复制代码
  ```

  ## Mocks

  在测试中，mock 可以让你更方便的去测试依赖于数据库、网络请求、文件等外部系统的函数。 Jest 内置了 mock 机制，提供了多种 mock 方式已应对各种需求。

  ### Mock 函数

  函数的 mock 非常简单，调用 `jest.fn()` 即可获得一个 mock 函数。 Mock 函数有一个特殊的 `.mock` 属性，保存着函数的调用信息。`.mock` 属性还会追踪每次调用时的 `this`。

  ```
  // mocks/forEach.js
  export default (items, callback) => {
    for (let index = 0; index < items.length; index++) {
      callback(items[index])
    }
  }
  
  import forEach from './forEach'
  
  it('test forEach function', () => {
    const mockCallback = jest.fn(x => 42 + x)
    forEach([0, 1], mockCallback)
  
  // The mock function is called twice
    expect(mockCallback.mock.calls.length).toBe(2)
  
  // The first argument of the first call to the function was 0
    expect(mockCallback.mock.calls[0][0]).toBe(0)
  
  // The first argument of the second call to the function was 1
    expect(mockCallback.mock.calls[1][0]).toBe(1)
  
  // The return value of the first call to the function was 42
    expect(mockCallback.mock.results[0].value).toBe(42)
  })
  复制代码
  ```

  除了 `.mock` 之外，Jest 还未我们提供了一些匹配器用来断言函数的执行，它们本身只是检查 `.mock` 属性的语法糖：

  ```
  // The mock function was called at least once
  expect(mockFunc).toBeCalled();
  复制代码
  ```

  使用 `mockReturnValue` 和 `mockReturnValueOnce` 可以 mock 函数的返回值。 当我们需要为 mock 函数增加一些逻辑时，可以使用 `jest.fn()`、`mockImplementation` 或者 `mockImplementationOnce` mock 函数的实现。 还可以使用 `mockName` 还给 mock 函数命名，如果没有命名，输出的日志默认就会打印 `jest.fn()`。

  ### Mock 定时器

  Jest 可以 Mock 定时器以使我们在测试代码中控制“时间”。调用 `jest.useFakeTimers()` 函数可以伪造定时器函数，定时器中的回调函数不会被执行，使用 `setTimeout.mock` 等可以断言定时器执行情况。当在测试中有多个定时器时，执行 `jest.useFakeTimers()` 可以重置内部的计数器。

  执行 `jest.runAllTimers();` 可以“快进”直到所有的定时器被执行；执行 `jest.runOnlyPendingTimers()` 可以使当前正在等待的定时器被执行，用来处理定时器中设置定时器的场景，如果使用 `runAllTimers` 会导致死循环；执行 `jest.advanceTimersByTime(msToRun:number)`，可以“快进”执行的毫秒数。

  ### Mock 模块

  模块的 mock 主要有两种方式：

  - 使用 `jest.mock(moduleName, factory, options)` 自动 mock 模块，jest 会自动帮我们 mock 指定模块中的函数。其中，`factory` 和 `options` 参数是可选的。`factory` 是一个模块工厂函数，可以代替 Jest 的自动 mock 功能；`options` 用来创建一个不存在的需要模块。
  - 如果希望自己 mock 模块内部函数，可以在模块平级的目录下创建 `__mocks__` 目录，然后创建相应模块的 mock 文件。对于用户模块和 Node 核心模块（如：fs、path），我们仍需要在测试文件中显示的调用 `jest.mock()`，而其他的 Node 模块则不需要。

  此外，在 mock 模块时，`jest.mock()` 会被自动提升到模块导入前调用。

  对于类的 mock 基本和模块 mock 相同，支持自动 mock、手动 mock 以及调用带模块工厂参数的 `jest.mock()`，还可以调用 `jest.mockImplementation()` mock 构造函数。

  ## 快照测试

  快照测试是 Jest 提供的一个相当棒的 UI 测试功能，它会记录 React 结构树快照或其他可序列化的值，并与当前测试的值进行比较，如果不匹配则给出错误提示。快照应该被当做代码来对待，它需要被提交到版本库并进行 Review。

  如果组件渲染结果发生变化，测试将会失败。当组件正常调整时，我们可以调用 `jest -u` 更新快照。在监控模式下，我们可以通过交互式的命令更新快照。

  

  ![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1280" height="653"></svg>)

  

  下面通过一个简单的 text 组件来测试一下：

  ```
  // Text.js
  
  import React from 'react'
  
  export default ({className, children}) => {
    return (
      <span className={className}>{children}</span>
    )
  }
  复制代码
  ```

  除了 react 我们还需要安装依赖：`npm i -D babel-preset-react react-test-renderer`，其中 `babel-preset-react` 预设用来解析 jsx 语法，需要添加到 babel 配置中。

  测试代码如下：

  ```
  // Text.test.js
  
  import React from 'react'
  import renderer from 'react-test-renderer'
  
  import Text from './Text'
  
  it('render correctly', () => {
    const tree = renderer
      .create(<Text className="success">Snapshot testing</Text>)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
  复制代码
  ```

  执行测试代码后，会生成如下快照：

  ```
  // Jest Snapshot v1, https://goo.gl/fbAQLP
  
  exports[`render correctly 1`] = `
  <span
    className="success"
  >
    Snapshot testing
  </span>
  `;
  复制代码
  ```

  如果后续修改导致组件渲染结果发生变化，快照将会不匹配，测试则不通过。

  ![img](https://user-gold-cdn.xitu.io/2018/9/24/1660b0b7586db194?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

  ## Jest 命令行

  jest 命令行工具有有用的选项。运行 `jest -h` 可以查看所有可用的选项。所有的 Jest 的 配置项都可以通过命令行来指定。

  基本用法：`jest [--config=<pathToConfigFile>] [TestPathPattern]` 生成配置信息：`jest --init` 运行符合指定用模板或文件名的测试︰`jest path/to/my-test.js` 启动监视模式︰`jest --watch` 生成覆盖率报告：`jest --coverage`

  ## Jest 配置

  Jest 的一个理念是提供一套完整集成的“零配置”测试体验，开发人员可以直接上手编写测试用例。它为我们集成了测试常用的工具，多数情况下使用默认配置或少量的调整即可。

  Jest 的配置可以定义在 `package.json` 或 `jest.config.js` 文件中或通过命令行参数 `--config <path/to/js|json>`。配置并不是必须的，具体内容见[文档](https://link.juejin.im?target=https%3A%2F%2Fjestjs.io%2Fdocs%2Fzh-Hans%2Fconfiguration)，按需取用即可。

  PS：Jest 中 `testURL` 的默认值是 `about:blank`，在 jsdom 环境下运行会报错，设置了 `testURL` 为一个有效的 URL 后能够避免这个问题，如：`http://localhost`。