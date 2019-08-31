## 关于一道题的思考

```html
<div id="div1" onclick="console.log(7)">div1
    <div id="div2" onclick="console.log(6)">div2</div>
</div>
<script>
  const div1 = document.getElementById('div1')
  const div2 = document.getElementById('div2')

  div2.onclick = function () { console.log(5) }
  div1.addEventListener('click', function () { console.log(1) })
  div2.addEventListener('click', function () { console.log(2) }, false)
  div1.addEventListener('click', function () { console.log(3) }, { capture: true })
  div2.addEventListener('click', function () { console.log(4) }, { capture: true }) 
</script>
```

#### 点击div1

点击 div1 还是比较简单，  

> 7 - 1 - 3

#### 点击div2

> 3 - 5 -2 - 4 - 7 - 1

没有 6 是因为 被
`div2.onclick = function () { console.log(5) }` 这个事件所覆盖了


这里就压迫考虑捕获和冒泡的事件机制了

这里 addEventListener 事件 第三个参数

> Boolean，在DOM树中，注册了listener的元素， 是否要先于它下面的EventTarget，调用该listener。 当useCapture(设为true) 时，沿着DOM树向上冒泡的事件，不会触发listener。当一个元素嵌套了另一个元素，并且两个元素都对同一事件注册了一个处理函数时，所发生的事件冒泡和事件捕获是两种不同的事件传播方式。事件传播模式决定了元素以哪个顺序接收事件。进一步的解释可以查看 事件流 及 JavaScript Event order 文档。 如果没有指定， useCapture 默认为 false 。

总结下正常的 dom 事件流机制 是 先捕获 后冒泡

注意: 对于事件目标上的事件监听器来说，事件会处于“目标阶段”，而不是冒泡阶段或者捕获阶段。在目标阶段的事件会触发该元素（即事件目标）上的所有监听器，而不在乎这个监听器到底在注册时useCapture 参数值是true还是false。