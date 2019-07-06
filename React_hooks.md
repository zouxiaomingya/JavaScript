## 什么是 useState ？

首先 useState 是一个Hook，它允许您将React状态添加到功能组件

useState 是一个方法，它本身是无法存储状态的

其次，他运行在 FunctionalComponent 里面，本身也是无法保存状态的

useState 只接收一个参数 inital value，并看不出有什么特殊的地方。



## 为什么要 useState?

> 因为类组件有很多的痛点

1. 很难复用逻辑（只能用HOC，或者render props），会导致组件树层级很深
2. 会产生巨大的组件（指很多代码必须写在类里面）
3. 类组件很难理解，比如方法需要`bind`，`this`指向不明确
4. 

```javascript
// 可能是这样
class MyComponent extends React.Component {
  constructor() {
    // initiallize
    this.handler1 = this.handler1.bind(this)
    this.handler2 = this.handler2.bind(this)
    this.handler3 = this.handler3.bind(this)
    this.handler4 = this.handler4.bind(this)
    this.handler5 = this.handler5.bind(this)
    // ...more
  }
}

// 可能是这样的
export default withStyle(style)(connect(/*something*/)(withRouter(MyComponent)))
```



## 怎么用 useState？

> 开始之前先看一个简单的例子，在没有 Hooks 之前我们是这样来写的。

```javascript
import React, {Component} from 'react';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Switch: "打开"
    };
  }
  setSwitch = () => {
    this.state.Switch === "打开"
      ? this.setState({ Switch: "关闭" })
      : this.setState({ Switch: "打开" });
  };
  render() {
    return (
      <div>
        <p>现在是: {this.state.Switch}状态</p>
        <button onClick={this.setSwitch}>Change Me!</button>
      </div>
    );
  }
}
export default CommonCollectionPage;
```



> 以前函数式组件需要给他自己的状态的时候我们总是不得不把函数式组件变成 Class 类组件，现在有了 React Hooks 我们在也不需要因为一个小状态而将函数式组件变成类组件，上面的这个例子，就可以变成下面的这个方法来表现。

### useState 使用案例

```javascript
function App() {
  const [Switch, setSwitch] = useState("打开");
  const newName = () =>
    Switch === "打开" ? setSwitch("关闭") : setSwitch("打开");
  return (
    <div>
      <p>现在是: {Switch} 状态</p>
      <button onClick={newName}>Change Me!</button>
    </div>
  );
}
```



所以 useState 就是为了给函数式组件添加一个可以维护自身状态的功能。

操作地址[传送](https://codesandbox.io/s/2p6w5j886j)[门](https://codesandbox.io/s/2p6w5j886j)



### useState 注意事项

动态传递参数给 useState 的时候只有第一次才会生效

##  

## useEffect 是什么？

通过 useEffect 方法来代替了 class 类组件的 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`

三个组件，那如何一个钩子怎么使用才有 3 个钩子的不同效果呢：

首选我们先运行起来：

### useEffect 第一个参数

```javascript
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function App() {
  const [Switch, setSwitch] = useState("打开");
  const handleSwitch = _ =>
    Switch === "打开" ? setSwitch("关闭") : setSwitch("打开");
  const [num, setNum] = useState(0);
  const add = () => {
    setNum(num + 1);
  };
  const minus = () => {
    setNum(num - 1);
  };
  useEffect(() => {
    console.log("改变了状态");
  }, [num]);
  return (
    <div>
      <p>现在是: {Switch}状态</p>
      <button onClick={handleSwitch}>Change Me!</button>
      <p>数字: {num}</p>
      <button onClick={add}> +1 </button>
      <button onClick={minus}> -1 </button>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```



上面这个例子他会再初次渲染的时候打印 改变了状态 并且每次状态改变的时候都打印 改变了状态

那么这样的用法就是 `componentDidMount`, `componentDidUpdate`,的使用

### useEffect 第二个参数

> useEffect 方法中加入第二个参数 一个空对象 [ ]  那么之后只会在首次组件装载好的时候打印一次 
>
> 改变状态了

现在我们需要当 num 改变状态的时候 去打印 怎么办呢？



刚刚我们使用了一个空对象 那么只需要再这个对象中加入我们需要监听的状态那么他相当于使用了 , `componentDidUpdate`, 钩子函数例如



```javascript
useEffect(() => {
    console.log("改变了状态");
  }, [num]);
```

那么现在，当 activeUser 状态改变的时候我们会发现又打印出了 改变状态 这句话。而当 Switch 状态改变的时候并不会打印这句话。

### useEffect 的闭包使用

```javascript
import React, { useState, useEffect } from 'react';
function App() {
  useEffect(() => {
    console.log('装载了')
    return () => {
      console.log('卸载拉');
    };
  });
  return (
    <div>
      xxxx
    </div>
  );
}
export default App;
```



在 useEffect 中我们可以做两件事情，组件挂载完成时候，还有组件卸载时，只要在 useEffect  中使用闭包，在闭包中做我们想要在组件卸载时需要做的事就可以。



## this.state 和 useState



首先我们回顾下以前我们常常用的类组件，下面是一段实现计数器的代码：



```javascript
import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      count: 0
    };
  }
  componentDidMount() {
    setTimeout(() => {
      console.log(`count：${this.state.count}`);
    }, 3000);
  }
  componentDidUpdate() {
    setTimeout(() => {
      console.log(`count：${this.state.count}`);
    }, 3000);
  }
  render() {
    return (
      <div>
        <p>{this.state.count}</p>
        <button
          onClick={() =>
            this.setState({
              count: this.state.count + 1
            })
          }
        >
          点击 3 次
        </button>
      </div>
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

页面刷新立即，点击 3 次按钮，上述这个例子的打印结果会是什么？？？？

我们很清楚的了解 this.state 和 this.setState 所有我们会知道打印的是：



>  一段时间后依此打印 3，3，3，3



不过 hooks 中 useEffect 的运行机制并不是这样运作的。



```javascript
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      console.log(count);
    }, 3000);
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        点击 3 次
      </button>
    </div>
  );
}
```



> 一段时间后依此打印 0，1，2，3。

其实没有以前 this.state 使用印象，看到这段代码的打印结果，会认为这不是理所当然的吗？



那我们想让上面的类组件，也实现上述 0,1,2,3,4 效果 我们增加这 2 行代码

```javascript
//...

componentDidMount() {
    // 新增此行代码
    const newCount = this.state.count; 
    setTimeout(() => {
      console.log(newCount);
    }, 3000);
  }
  componentDidUpdate() {
    // 新增此行代码
    const newCount = this.state.count; 
    setTimeout(() => {
      console.log(newCount);
    }, 3000);
  }

  // ....
```

所有我们会联想到 在函数式组件中 取值下面的效果是一样的

```javascript
function Counter(props) {
  useEffect(() => {
    setTimeout(() => {
      console.log(props.counter);
    }, 3000);
  });
  // ...
}
```



```javascript
function Counter(props) {
  const counter = props.counter;
  useEffect(() => {
    setTimeout(() => {
      console.log(counter);
    }, 3000);
  });
  // ...
}
```



这一点说明了在渲染函数式组件的时候他的更新不会改变渲染范围内的 props ，state 的值。(表达可能有误)

当然，有时候我们会想在effect的回调函数里读取最新的值而不是之前的值。就像之前的类组件那样打印 3.3.3.3。这里最简单的实现方法是使用useRef。



## useRef 的使用方式

首先实现上诉打印 3，3，3，3 的问题。如下代码所示

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const latestCount = useRef(count);
  useEffect(() => {
    latestCount.current = count;
    setTimeout(() => {
      console.log(latestCount.current);
    }, 3000);
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        点击 3 次
      </button>
    </div>
  );
}
```



我们通过 useRef(initVal) 来返回一个可变的 ref 对象，其 current 属性被初始化为传递的参数 （initVal）。

### useRef 也可以获取 DOM 节点

然后函数式组件没有生命周期，那我们怎么才能获取 ChartDom 真实的 dom 元素呢？也可以通过 useRef 实现

```javascript
import React, { useState, useRef, Fragment, useEffect } from 'react';
import { Button } from 'antd';

function Demo({ count: propsCount = 1 }) {
  const [count, setCount] = useState(propsCount);
  const refContainer = useRef(null); // 如同之前的 React.createRef();
  
  useEffect(() => {
    console.log(refContainer.current, '>>>>>>>>>>>');
  });
  
  return (
      <Fragment>
        <Button onClick={() => { setCount(count + 1); }}>Click Me</Button>
        <p ref={refContainer}>You click {count} times</p>
      </Fragment>
  );
}

export default Demo;
```

###  useReducer 使用

```javascript
import React, { useReducer, useEffect } from "react";
import ReactDOM from "react-dom";

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state;

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <>
      <h1>{count}</h1>
      <input value={step} onChange={e => {
        dispatch({
          type: 'step',
          step: Number(e.target.value)
        });
      }} />
    </>
  );
}

const initialState = {
  count: 0,
  step: 1,
};

function reducer(state, action) {
  const { count, step } = state;
  if (action.type === 'tick') {
    return { count: count + step, step };
  } else if (action.type === 'step') {
    return { count, step: action.step };
  } else {
    throw new Error();
  }
}
```


## useImperativeHandle 使用

在类组件中我们都是通过使用 ref 的方式 获取类组件的实例，这样就可以让父组件调用子组件的方法。

那么函数式没有实例，怎么使用 ref 呢?

![](https://user-gold-cdn.xitu.io/2019/7/1/16bad5e988078764?w=720&h=120&f=png&s=36784)

```javascript
// 子组件
import React, { useRef, useImperativeHandle,forwardRef } from "react";
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
export default forwardRef(FancyInput);

// 父组件
import React, { useRef } from "react";
function App(){
  const fancyInputRef = useRef(null)
  // 这样获取子组件方法
  fancyInputRef.current.focus()
  return (
    <div> 
      <FancyInput ref={fancyInputRef} /> 
    </div>
  )

}
```



### 最后

实战使用 hooks 也快 3 4 个月了。确实感觉到了 React 慢慢变得更加强大，函数式组件使用也是非常精简和方便，个人认为脱离了 Class 代码的可读性，可维护性也感觉更加高了。

> 全文章，如有错误或不严谨的地方，请务必给予指正，谢谢！

个人其他文章推荐：

1. [Axios 源码解读](<https://juejin.im/post/5cb5d9bde51d456e62545abc>)
2. [Fetch 实例讲解](<https://juejin.im/post/5c754d42e51d454dfd2a4b6b>)

参考：

- [React 文档](https://react.docschina.org/docs/hooks-intro.html)
- [Dan Abramov 博客](<https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/>)
- [useEffect 完全指南](<https://github.com/dt-fe/weekly/blob/master/96.%E7%B2%BE%E8%AF%BB%E3%80%8AuseEffect%20%E5%AE%8C%E5%85%A8%E6%8C%87%E5%8D%97%E3%80%8B.md>)
