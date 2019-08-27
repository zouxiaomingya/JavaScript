React Hooks 源码模拟与解读
useState 解析
useState 使用
通常我们这样来使用 useState 方法

function App() {
  const [num, setNum] = useState(0);
  const add = () => {
    setNum(num + 1);
  };
  return (
    <div>
      <p>数字: {num}</p>
      <button onClick={add}> +1 </button>
    </div>
  );
}
复制代码
useState 的使用过程，我们先模拟一个大概的函数

function useState(initialValue) {
  var value = initialValue
  function setState(newVal) {	
    value = newVal
  }
  return [value, setState]
}
复制代码
这个代码有一个问题，在执行 useState 的时候每次都会 var _val = initialValue，初始化数据；

于是我们可以用闭包的形式来保存状态。

const MyReact = (function() {
   // 定义一个 value 保存在该模块的全局中
  let value
  return {
    useState(initialValue) {
      value = value || initialValue 
      function setState(newVal) {
        value = newVal
      }
      return [value, setState]
    }
  }
})()
复制代码
这样在每次执行的时候，就能够通过闭包的形式 来保存 value。

不过这个还是不符合 react 中的 useState。因为在实际操作中会出现多次调用，如下。

function App() {
  const [name, setName] = useState('Kevin');
  const [age, setAge] = useState(0);
  const handleName = () => {
    setNum('Dom');
  };
  const handleAge = () => {
    setAge(age + 1);
  };
  return (
    <div>
      <p>姓名: {name}</p>
      <button onClick={handleName}> 改名字 </button>
 	  <p>年龄: {age}</p>
      <button onClick={handleAge}> 加一岁 </button>
    </div>
  );
}
复制代码
因此我们需要在改变 useState 储存状态的方式

useState 模拟实现
const MyReact = (function() {
  // 开辟一个储存 hooks 的空间
  let hooks = []; 
  // 指针从 0 开始
  let currentHook = 0 
  return {
    // 伪代码 解释重新渲染的时候 会初始化 currentHook
    render(Component) {
      const Comp = Component()
      Comp.render()
      currentHook = 0 // 重新渲染时候改变 hooks 指针
      return Comp
    },      
    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue
      const setStateHookIndex = currentHook
      // 这里我们暂且默认 setState 方式第一个参数不传 函数，直接传状态
      const setState = newState => (hooks[setStateHookIndex] = newState)
      return [hooks[currentHook++], setState]
    }
  }
})()
复制代码
因此当重新渲染 App 的时候，再次执行 useState 的时候传入的参数 kevin , 0 也就不会去使用，而是直接拿之前 hooks 存储好的值。

hooks 规则
官网 hoos 规则中明确的提出 hooks 不要再循环，条件或嵌套函数中使用。


为什么不可以？
我们来看下

下面这样一段代码。执行 useState 重新渲染，和初始化渲染 顺序不一样就会出现如下问题

如果了解了上面 useState 模拟写法的存储方式，那么这个问题的原因就迎刃而解了。



useEffect 解析
useEffect 使用
初始化会 打印一次 ‘useEffect_execute’， 改变年龄重新render，会再打印， 改变名字重新 render， 不会打印。因为依赖数组里面就监听了 age 的值

import React, { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState('Kevin');
  const [age, setAge] = useState(0);
  const handleName = () => {
    setName('Don');
  };
  const handleAge = () => {
    setAge(age + 1);
  };
  useEffect(()=>{
    console.log('useEffect_execute')
  }, [age])
  return (
    <div>
      <p>姓名: {name}</p>
      <button onClick={handleName}> 改名字 </button>
      <p>年龄: {age}</p>
      <button onClick={handleAge}> 加一岁 </button>
    </div>
  );
}
export default App;

复制代码
useEffect 的模拟实现
const MyReact = (function() {
  // 开辟一个储存 hooks 的空间
  let hooks = []; 
  // 指针从 0 开始
  let currentHook = 0 ；
  // 定义个模块全局的 useEffect 依赖
  let deps;
  return {
    // 伪代码 解释重新渲染的时候 会初始化 currentHook
    render(Component) {
      const Comp = Component()
      Comp.render()
      currentHook = 0 // 重新渲染时候改变 hooks 指针
      return Comp
    },      
    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue
      const setStateHookIndex = currentHook
      // 这里我们暂且默认 setState 方式第一个参数不传 函数，直接传状态
      const setState = newState => (hooks[setStateHookIndex] = newState)
      return [hooks[currentHook++], setState]
    }
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray
      // 如果没有依赖，说明是第一次渲染，或者是没有传入依赖参数，那么就 为 true
      // 有依赖 使用 every 遍历依赖的状态是否变化， 变化就会 true
      const hasChangedDeps = deps ? !depArray.every((el, i) => el === deps[i]) : true
      // 如果有 依赖， 并且依赖改变
      if (hasNoDeps || hasChangedDeps) {
        // 执行 
        callback()
        // 更新依赖
        deps = depArray
      }
    },
        
  }
})()
复制代码
useEffect 注意事项
依赖项要真实
依赖需要想清楚。

刚开始使用 useEffect 的时候，我只有想重新触发 useEffect 的时候才会去设置依赖

那么也就会出现如下的问题。

希望的效果是界面中一秒增加一岁

import React, { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState('Kevin');
  const [age, setAge] = useState(0);
  const handleName = () => {
    setName('Don');
  };
  const handleAge = () => {
    setAge(age + 1);
  };
  useEffect(() => {
    setInterval(() => {
      setAge(age + 1);
      console.log(age)
    }, 1000);
  }, []);
  return (
    <div>
      <p>姓名: {name}</p>
      <button onClick={handleName}> 改名字 </button>
      <p>年龄: {age}</p>
      <button onClick={handleAge}> 加一岁 </button>
    </div>
  );
}
export default App;

复制代码
其实你会发现 这里界面就增加了 一次 年龄。究其原因:

**在第一次渲染中，age是0。因此，setAge(age+ 1)在第一次渲染中等价于setAge(0 + 1)。然而我设置了0依赖为空数组，那么之后的 useEffect 不会再重新运行，它后面每一秒都会调用setAge(0 + 1) **

也就是当我们需要 依赖 age 的时候我们 就必须再 依赖数组中去记录他的依赖。这样useEffect 才会正常的给我们去运行。

所以我们想要每秒都递增的话有两种方法

方法一：

真真切切的把你所依赖的状态填写到 数组中

  // 通过监听 age 的变化。来重新执行 useEffect 内的函数
  // 因此这里也就需要记录定时器，当卸载的时候我们去清空定时器，防止多个定时器重新触发
  useEffect(() => {
    const id = setInterval(() => {
      setAge(age + 1);
    }, 1000);
    return () => {
      clearInterval(id)
    };
  }, [age]);

复制代码
方法二

useState 的参数传入 一个方法。

注：上面我们模拟的 useState 并没有做这个处理 后面我会讲解源码中去解析。

useEffect(() => {
    setInterval(() => {
      setAge(age => age + 1);
    }, 1000);
  }, []);
复制代码
useEffect 只运行了一次，通过 useState 传入函数的方式它不再需要知道当前的age值。因为 React render 的时候它会帮我们处理

这正是setAge(age => age + 1)做的事情。再重新渲染的时候他会帮我们执行这个方法，并且传入最新的状态。

所以我们做到了去时刻改变状态，但是依赖中却不用写这个依赖，因为我们将原本的使用到的依赖移除了。（这句话表达感觉不到位）

接口无限请求问题
刚开始使用 useEffect 的我，在接口请求的时候常常会这样去写代码。

props 里面有 页码，通过切换页码，希望监听页码的变化来重新去请求数据

// 以下是伪代码 
// 这里用 dva 发送请求来模拟

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

function App(props) {
  const { goods， dispatch, page } = props;
  useEffect(() => {
    // 页面完成去发情请求
   dispatch({
      type: '/goods/list',
      payload: {page, pageSize:10},
    });
    // xxxx 
  }, [props]);
  return (
    <div>
      <p>商品: {goods}</p>
	 <button>点击切下一页</button>
    </div>
  );
}
export default connect(({ goods }) => ({
  goods,
}))(App);
复制代码
然后得意洋洋的刷新界面，发现 Network 中疯狂循环的请求接口，导致页面的卡死。

究其原因是因为在依赖中，我们通过接口改变了状态 props 的更新， 导致重新渲染组件，导致会重新执行 useEffect 里面的方法，方法执行完成之后 props 的更新， 导致重新渲染组件，依赖项目是对象，引用类型发现不相等，又去执行 useEffect 里面的方法，又重新渲染，然后又对比，又不相等， 又执行。因此产生了无限循环。

Hooks 源码解析
该源码位置: react/packages/react-reconciler/src/ReactFiberHooks.js

const Dispatcher={
  useReducer: mountReducer,
  useState: mountState,
  // xxx 省略其他的方法
}
复制代码
mountState 源码
function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
    /*
    mountWorkInProgressHook 方法 返回初始化对象
    {
        memoizedState: null,
        baseState: null, 
        queue: null,
        baseUpdate: null,
        next: null,
  	}
    */
  const hook = mountWorkInProgressHook();
 // 如果传入的是函数 直接执行，所以第一次这个参数是 undefined
  if (typeof initialState === 'function') {
    initialState = initialState();
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue = (hook.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  });

	/*
	定义 dispatch 相当于
	const dispatch = queue.dispatch =
	dispatchAction.bind(null,currentlyRenderingFiber，queue);
	*/ 
  const dispatch: Dispatch<
    BasicStateAction<S>,
  > = (queue.dispatch = (dispatchAction.bind(
    null,
    // Flow doesn't know this is non-null, but we do.
    ((currentlyRenderingFiber: any): Fiber),
    queue,
  ): any));

 // 可以看到这个dispatch就是dispatchAction绑定了对应的 currentlyRenderingFiber 和 queue。最后return：
  return [hook.memoizedState, dispatch];
}
复制代码
dispatchAction 源码
function dispatchAction<A>(fiber: Fiber, queue: UpdateQueue<A>, action: A) {
  //... 省略验证的代码
  const alternate = fiber.alternate;
    /*
    这其实就是判断这个更新是否是在渲染过程中产生的，currentlyRenderingFiber只有在FunctionalComponent更新的过程中才会被设置，在离开更新的时候设置为null，所以只要存在并更产生更新的Fiber相等，说明这个更新是在当前渲染中产生的，则这是一次reRender。
所有更新过程中产生的更新记录在renderPhaseUpdates这个Map上，以每个Hook的queue为key。
对于不是更新过程中产生的更新，则直接在queue上执行操作就行了，注意在最后会发起一次scheduleWork的调度。
    */
  if (
    fiber === currentlyRenderingFiber ||
    (alternate !== null && alternate === currentlyRenderingFiber)
  ) {
    didScheduleRenderPhaseUpdate = true;
    const update: Update<A> = {
      expirationTime: renderExpirationTime,
      action,
      next: null,
    };
    if (renderPhaseUpdates === null) {
      renderPhaseUpdates = new Map();
    }
    const firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
    if (firstRenderPhaseUpdate === undefined) {
      renderPhaseUpdates.set(queue, update);
    } else {
      // Append the update to the end of the list.
      let lastRenderPhaseUpdate = firstRenderPhaseUpdate;
      while (lastRenderPhaseUpdate.next !== null) {
        lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
      }
      lastRenderPhaseUpdate.next = update;
    }
  } else {
    const currentTime = requestCurrentTime();
    const expirationTime = computeExpirationForFiber(currentTime, fiber);
    const update: Update<A> = {
      expirationTime,
      action,
      next: null,
    };
    flushPassiveEffects();
    // Append the update to the end of the list.
    const last = queue.last;
    if (last === null) {
      // This is the first update. Create a circular list.
      update.next = update;
    } else {
      const first = last.next;
      if (first !== null) {
        // Still circular.
        update.next = first;
      }
      last.next = update;
    }
    queue.last = update;
    scheduleWork(fiber, expirationTime);
  }
}
复制代码
mountReducer 源码
多勒第三个参数，是函数执行，默认初始状态 undefined

其他的和 上面的 mountState 大同小异

function mountReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  const hook = mountWorkInProgressHook();
  let initialState;
  if (init !== undefined) {
    initialState = init(initialArg);
  } else {
    initialState = ((initialArg: any): S);
  }
	// 其他和 useState 一样
  hook.memoizedState = hook.baseState = initialState;
  const queue = (hook.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: (initialState: any),
  });
  const dispatch: Dispatch<A> = (queue.dispatch = (dispatchAction.bind(
    null,
    // Flow doesn't know this is non-null, but we do.
    ((currentlyRenderingFiber: any): Fiber),
    queue,
  ): any));
  return [hook.memoizedState, dispatch];
}
复制代码
通过 react 源码中，可以看出 useState 是特殊的 useReducer

可见useState不过就是个语法糖，本质其实就是useReducer
updateState 复用了 updateReducer（区别只是 updateState 将 reducer 设置为 updateReducer）
mountState 虽没直接调用 mountReducer，但是几乎大同小异（区别只是 mountState 将 reducer 设置为basicStateReducer）
注：这里仅是 react 源码，至于重新渲染这块 react-dom 还没有去深入了解。

更新：
分两种情况，是否是 reRender，所谓reRender就是说在当前更新周期中又产生了新的更新，就继续执行这些更新知道当前渲染周期中没有更新为止

他们基本的操作是一致的，就是根据 reducer 和 update.action 来创建新的 state，并赋值给Hook.memoizedState 以及 Hook.baseState。

注意这里，对于非reRender得情况，我们会对每个更新判断其优先级，如果不是当前整体更新优先级内得更新会跳过，第一个跳过得Update会变成新的baseUpdate，他记录了在之后所有得Update，即便是优先级比他高得，因为在他被执行得时候，需要保证后续的更新要在他更新之后的基础上再次执行，因为结果可能会不一样。

来源

preact 中的 hooks
Preact 最优质的开源 React 替代品！（轻量级 3kb）

注意：这里的替代是指如果不用 react 的话，可以使用这个。而不是取代。

useState 源码解析
调用了 useReducer 源码


export function useState(initialState) {
	return useReducer(invokeOrReturn, initialState);
}
复制代码
useReducer 源码解析
// 模块全局定义
/** @type {number} */
let currentIndex; // 状态的索引，也就是前面模拟实现 useState 时候所说的指针

let currentComponent; // 当前的组件

export function useReducer(reducer, initialState, init) {
	/** @type {import('./internal').ReducerHookState} */
    // 通过 getHookState 方法来获取 hooks 
	const hookState = getHookState(currentIndex++);

	// 如果没有组件 也就是初始渲染
	if (!hookState._component) {
		hookState._component = currentComponent;
		hookState._value = [
			// 没有 init 执行 invokeOrReturn
				// invokeOrReturn 方法判断 initialState 是否是函数
				// 是函数 initialState(null) 因为初始化没有值默认为null
				// 不是函数 直接返回 initialState
			!init ? invokeOrReturn(null, initialState) : init(initialState),

			action => {
				// reducer == invokeOrReturn
				const nextValue = reducer(hookState._value[0], action);
				// 如果当前的值,不等于 下一个值
				// 也就是更新的状态的值,不等于之前的状态的值
				if (hookState._value[0]!==nextValue) {
					// 储存最新的状态
					hookState._value[0] = nextValue;
					// 渲染组件
					hookState._component.setState({});
				}
			}
		];
	}
    // hookState._value 数据格式也就是 [satea：any, action:Function] 的数据格式拉
	return hookState._value;
}

复制代码
getHookState 方法
function getHookState(index) {
	if (options._hook) options._hook(currentComponent);
	const hooks = currentComponent.__hooks || (currentComponent.__hooks = { _list: [], _pendingEffects: [], _pendingLayoutEffects: [] });

	if (index >= hooks._list.length) {
		hooks._list.push({});
	}
	return hooks._list[index];
}
复制代码
invokeOrReturn 方法
function invokeOrReturn(arg, f) {
	return typeof f === 'function' ? f(arg) : f;
}
复制代码
总结
使用 hooks 几个月了。基本上所有类组件我都使用函数式组件来写。现在 react 社区的很多组件，都也开始支持hooks。大概了解了点重要的源码，做到知其然也知其所以然，那么在实际工作中使用他可以减少不必要的 bug，提高效率。

最后
全文章，如有错误或不严谨的地方，请务必给予指正，谢谢！

参考：

Don 神博客
Deep dive: How do React hooks really work?
React hooks源码解析
