# 使用 useContext 封装自己的状态管理（十几行代码）

## 开头

一个项目，一个复杂的逻辑，我觉得状态管理显得尤为的重要，状态管理的好不好，直接体现了一个项目的逻辑性、可读性、维护性等是否清晰，易读，和高效。

从最早的类组件使用 this.state, this.setState 去管理状态，到 redux , subscribe, dispatch 的发布订阅，redux 的使用就面临重复和沉重的的 reducer，让我俨然变成了 Ctrl CV 工程师。于是后面接触 [dva](https://dvajs.com/guide/#特性)，它是一个基于 [redux](https://github.com/reduxjs/redux) 和 [redux-saga](https://github.com/redux-saga/redux-saga) 的数据流方案。通过 model 来分片管理全局状态，使用 connect 方法去给需要的深层次的组件传递状态。

到后面 react hooks 出来之后，业界也出了很多自身管理状态的，基于 hooks 封装，各个模块都有一个基于自己 hooks 的状态 store。确实很好的解决了函数组件的状态管理，和模块自身内部的状态管理，但是还是解决不了在全局组件中，层层传递的状态依赖让结构变得复杂，繁琐的问题。不用任何的管理工具我们如何做到跨组件通信？

## 为什么不用？

不是说我们不去用 dva 这样的管理工具？我并不是说 dva 不好用，而是我觉得有时候没必要用。我觉得他太重了。

## 学到什么？

读完这边文章，即使你觉得我的管理方式不好，你也可以学习和了解到 useMemo, useContext，useImmer等。

## react context

[Context-React](https://zh-hans.reactjs.org/docs/context.html) 官网介绍

```
// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
// 为当前的 theme 创建一个 context（“light”为默认值）。
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // 无论多深，任何组件都能读取这个值。
    // 在这个例子中，我们将 “dark” 作为当前的值传递下去。
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // 指定 contextType 读取当前的 theme context。
  // React 会往上找到最近的 theme Provider，然后使用它的值。
  // 在这个例子中，当前的 theme 值为 “dark”。
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
复制代码
```

### createContext 实现跨组件通信的大致过程

```
const MyContext = React.createContext(defaultValue);

<MyContext.Provider value={/* 某个值 */}>
    <App>
      ... 多层组件嵌套内有一个 Goods 组件
            <Goods />
  </App>  
</MyContext.Provider >


// 某个 子子子子子组件 Goods
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
复制代码
```

### 具体实际案例

**app.js**

```
import {ThemeContext, themes} from './theme-context';
import ThemeTogglerButton from './theme-toggler-button';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggleTheme = () => {
      this.setState(state => ({
        theme:
          state.theme === themes.dark
            ? themes.light
            : themes.dark,
      }));
    };

    // State 也包含了更新函数，因此它会被传递进 context provider。
    this.state = {
      theme: themes.light,
      toggleTheme: this.toggleTheme,
    };
  }

  render() {
    // 整个 state 都被传递进 provider
    return (
      <ThemeContext.Provider value={this.state}>
        <Content />
      </ThemeContext.Provider>
    );
  }
}

function Content() {
  return (
    <div>
      <ThemeTogglerButton />
    </div>
  );
}

ReactDOM.render(<App />, document.root);
复制代码
// Theme context，默认的 theme 是 “light” 值
const ThemeContext = React.createContext('light');

// 用户登录 context
const UserContext = React.createContext({
  name: 'Guest',
});

class App extends React.Component {
  render() {
    const {signedInUser, theme} = this.props;

    // 提供初始 context 值的 App 组件
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

function Layout() {
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

// 一个组件可能会消费多个 context
function Content() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <ProfilePage user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}
复制代码
```

## 封装自己的跨组件管理方式

> ./connect.js 文件

### 封装 connect 方法

使用 connect 也是基于 react-redux 思想，把它封装为一个方法。调用 connect 方法返回的是一个高阶组件。并且 connect 方法中支持传入一个函数，来过滤，筛选子组件需要的状态，也便于维护 重新 render 等

```
import React, { createContext } from 'react';
import { useImmer } from 'use-immer';
// useImmer 文章末尾有介绍推荐

const ctx = createContext();
const { Consumer, Provider } = ctx

const useModel = (initialState) => {
  const [state, setState] = useImmer(initialState);
  return [
    state,
    setState
  ];
}

const createProvider = () => {
  function WrapProvider(props) {
    const { children, value } = props;
    const [_state, _dispatch] = useModel(value)
    return (
      <Provider value={{
        _state,
        _dispatch,
      }}>
        {children}
      </Provider>
    )
  }
  return WrapProvider
}

export const connect = fn => ComponentUi => () => {
  return (
    <Consumer>
      {
        state => {
          const {_state, _dispatch} = state
          const selectState = typeof fn === 'function' ? fn(_state) : _state;
          return <ComponentUi _state={selectState} _dispatch={_dispatch} />
        }
      }
    </Consumer>
  )
};

export default createProvider;
复制代码
```

### 使用方式

```
import React from 'react';
import Header from './layout/Header.jsx';
import Footer from './layout/Footer.jsx';
import createProvider from './connect';

const Provider = createProvider()

const initValue = { user: 'xiaoming', age: 12 }
function App() {
  return (
    <Provider value={initValue}>
        <Header />
        <Footer />
    </Provider>

  )
}
export default App;
复制代码
```

> Header.jsx

```
import React from 'react';
import { Select } from 'antd';
import { connect } from '../connect';
const { Option } = Select;

function Head({ _state: { user, age }, _dispatch }) {
  return (
    <div className="logo" >
      <Select defaultValue={user} value={user} onChange={(value) => {
        _dispatch(draft => {
          draft.user = value
        })
      }}>
        <Option value='xiaoming'>小明</Option>
        <Option value='xiaohong'>小红</Option>
      </Select>
      <span>年龄{age}</span>
    </div>
  )
}

export default connect()(Head);
复制代码
```

> Footer.jsx

```
import React, { Fragment } from 'react';
import { Select } from 'antd';
import { connect } from '../../connect';

const { Option } = Select;
function Footer({ _state, _dispatch }) {
  const { user, age } = _state;
  return (
    <Fragment>
      <p style={{marginTop: 40}}>用户：{user}</p>
      <p>年龄{age}</p>
      <div>
        <span>改变用户:</span>
        <Select
          defaultValue={user}
          value={user}
          onChange={(value) => {
            _dispatch(draft => {
              draft.user = value
            })
          }}>
          <Option value='xiaoming'>小明</Option>
          <Option value='xiaohong'>小红</Option>
        </Select></div>
      <div>
        <span>改变年龄:</span>
        <input onChange={(e) => {
          // 这里使用 persist 原因可以看文章末尾推荐
          e.persist();
          _dispatch(draft => {
            draft.age = e.target.value
          })
        }} />
      </div>
    </Fragment>
  )
}

export default connect()(Footer);
复制代码
```

### 使用 useContext

我们都知道 react 16.8 以后也出了 useContext 那么我们可以通过使用 useContext 来优化 connect 方法

```
// 未使用 useContext
export const connect = (fn) => (ComponentUi) => () => {
  const state = useContext(ctx)
  console.log(state);
  return (
    <Consumer>
      {
        state => {
          const { _state, _dispatch } = state
          const selectState = typeof fn === 'function' ? fn(_state) : _state;
          return <ComponentUi _state={selectState} _dispatch={_dispatch} />
        }
      }
    </Consumer>
  )
};

// 使用 useContext
export const connect = fn => ComponentUi => () => {
  const { _state, _dispatch } = useContext(ctx);
  const selectState = typeof fn === 'function' ? fn(_state) : _state;
  return <ComponentUi _state={selectState} _dispatch={_dispatch} />;
};
复制代码
```

注意： 调用了 `useContext` 的组件总会在 context 值变化时重新渲染。如果重渲染组件的开销较大，你可以通过文章末尾推荐的不必要重新 render 开销大的组件去了解如何优化。

### 最后

[github地址](https://github.com/zouxiaomingya/blog)

4步代码跑起来

```
git clone https://github.com/zouxiaomingya/blog
cd blog
npm i
npm start
复制代码
```

> 全文章，如有错误或不严谨的地方，请务必给予指正，谢谢！

参考：

- [react useContext 文档](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecontext)
- [不必要的重新 render 开销大的组件](https://kentcdodds.com/blog/usememo-and-usecallback/)