## 描述

- 如果 element 是 Document，DocumentType 或者 Notation 类型节点，则 `textContent` 返回 `null`。如果你要获取整个文档的文本以及CDATA数据，可以使用`document.documentElement.textContent`。
- 如果节点是个CDATA片段，注释，ProcessingInstruction节点或一个文本节点，`textContent` 返回节点内部的文本内容（即 [nodeValue](https://developer.mozilla.org/zh-CN/docs/DOM/Node.nodeValue)）。
- 对于其他节点类型，`textContent` 将所有子节点的 `textContent` 合并后返回，除了注释、ProcessingInstruction节点。如果该节点没有子节点的话，返回一个空字符串。
- 在节点上设置 `textContent` 属性的话，会删除它的所有子节点，并替换为一个具有给定值的文本节点。

### 与**innerText**的区别



Internet Explorer 引入了 [`node.innerText`](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/innerText)。意图类似，但有以下区别：

- **`textContent`** 会获取所有元素的内容，包括 [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script) 和 [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/style) 元素，然而 **innerText** 不会。
- `innerText` 受 CSS 样式的影响，并且不会返回隐藏元素的文本，而textContent会。
- 由于 `innerText` 受 CSS 样式的影响，它会触发重排（reflow），但`textContent` 不会。
- `与 textContent 不同的是`, 在 Internet Explorer (对于小于等于 IE11 的版本) 中对 innerText 进行修改， 不仅会移除当前元素的子节点，而且还会永久性地破坏所有后代文本节点（所以不可能再次将节点再次插入到任何其他元素或同一元素中）。

### 与**innerHTML**的区别



`正如`其名称`，innerHTML` `返回` `HTML` `文本。`通常，为了在元素中检索或写入文本，人们使用innerHTML。但是，textContent通常具有更好的性能，因为文本不会被解析为HTML。此外，使用textContent可以防止  XSS 攻击。