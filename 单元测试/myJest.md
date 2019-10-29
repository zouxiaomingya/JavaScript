# Jest
常用的匹配器如下：

toBe 使用 Object.is 判断是否严格相等。
toEqual 递归检查对象或数组的每个字段。
toBeNull 只匹配 null。
toBeUndefined 只匹配 undefined。
toBeDefined 只匹配非 undefined。
toBeTruthy 只匹配真。
toBeFalsy 只匹配假。
toBeGreaterThan 实际值大于期望。- # Jest 实例教程

  [Jest](https://link.juejin.im/?target=https%3A%2F%2Fjestjs.io%2F) 是由 Facebook 开源出来的一个测试框架，它集成了断言库、mock、快照测试、覆盖率报告等功能。它非常适合用来测试 React 代码，但不仅仅如此，所有的 js 代码都可以使用 Jest 进行测试。

  ## 初始化

  ###  安 装 jest

  ```
  $ npm i -D jest
  ```

  ###  生成 package.json

  ```
  npm init -y
  ```

  ### 修改 package.json

  在 `package.json` 文件中添加下面的内容：

  ```
  "scripts": {
    "test": "jest"
  }
  ```

  这样你就可以直接在命令行使用 `jest` 命令。如果你是本地安装，但是也想在命令行使用 `jest`，可以通过 `node_modules/.bin/webpack` 访问它的 bin 版本，如果你的 npm 版本在 **5.2.0** 以上，你也可以通过 `npx jest` 访问。

  ### 使用 Babel

  如果你在代码中使用了新的语法特性，而当前 Node 版本不支持，则需要使用 Babel 进行转义。

  安装如下依赖

  ```json
    "devDependencies": {
      "@babel/core": "^7.6.4",
      "@babel/preset-env": "^7.6.3",
      "babel-core": "^6.26.3",
      "babel-jest": "^24.9.0",
      "babel-preset-env": "^1.7.0"
    }
  ```

  我们还需在根目录下创建 `.babelrc` 文件：

  ```json
  { "presets": ["@babel/preset-env"] }
  ```

  ## 基本用法

  我们从一个基本的 Math 模块开始。首先创建一个 `math.js` 文件：

  ```javascript
  // index.js
  
  const sum = (a, b) => a + b
  const mul = (a, b) => a * b
  const sub = (a, b) => a - b
  const div = (a, b) => a / b
  
  export { sum, mul, sub, div }
  ```

  要测试这个 Math 模块是否正确，我们需要编写测试代码。通常，测试文件与所要测试的源码文件同名，但是后缀名为 `.test.js` 或者 `.spec.js`。我们这里则创建一个 `math.test.js` 文件：

  ```javascript
  // index.test.js
  
  import { sum, mul, sub, div } from './index'
  
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

  执行 `npm test` Jest 将会执行所有匹配的测试文件，并最终返回测试结果：通过测试会有绿色勾

  大致信息如下

  ```
    √ Adding 1 + 1 equals 2 (3ms)
    √ Multiplying 1 * 1 equals 1
    √ Subtracting 1 - 1 equals 0 (1ms)
    √ Dividing 1 / 1 equals 1
  
  Test Suites: 1 passed, 1 total
  Tests:       4 passed, 4 total
  Snapshots:   0 total
  Time:        3.6s
  ```
  测试单个文件可以使用
  > jest <name>

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

  - `toBe` 使用 [Object.is](https://link.juejin.im/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2Fis) 判断是否严格相等。
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

## 异步测试
当执行到测试代码的尾部时，Jest 即认为测试完成。因此，如果存在异步代码，Jest 不会等待回调函数执行。要解决这个问题，在测试函数中我们接受一个参数叫做 done，Jest 将会一直等待，直到我们调用 done()。如果一直不调用 done()，则此测试不通过。
```javaScript
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
```
复制代码expect.assertions(1) 验证当前测试中有 1 处断言会被执行，在测试异步代码时，能确保回调中的断言被执行。
