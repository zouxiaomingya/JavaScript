## Ant Design 组件源码解析
> git clone https://github.com/ant-design/ant-design.git

直接进入 component 文件，可有看到所有的组件包

### Typography 排版组件
> 进入 typography 文件夹下的 typography.tsx， 下面就是这个的源码，删除了部分的 ts 类型声明
```jsx
const Typography: React.RefForwardingComponent<{}, InternalTypographyProps> = (
  {
    prefixCls: customizePrefixCls,
    component = 'article',
    className,
    'aria-label': ariaLabel,
    setContentRef,
    children,
    ...restProps
  },
  ref,
) => {
  let mergedRef = ref;

  return (
    <ConfigConsumer>
      {({ getPrefixCls }: ConfigConsumerProps) => {
        const Component = component as any;
        const prefixCls = getPrefixCls('typography', customizePrefixCls);

        return (
          <Component
            className={classNames(prefixCls, className)}
            aria-label={ariaLabel}
            ref={mergedRef}
            {...restProps}
          >
            {children}
          </Component>
        );
      }}
    </ConfigConsumer>
  );
};

let RefTypography;

if (React.forwardRef) {
  RefTypography = React.forwardRef(Typography);
  RefTypography.displayName = 'Typography';
} else {
  class TypographyWrapper extends React.Component<TypographyProps, {}> {
    state = {};

    render() {
      return <Typography {...this.props} />;
    }
  }

  RefTypography = TypographyWrapper;
}

export default RefTypography;

```
 #### base.tsx 是该组件的核心内容

> syncEllipsis 组件是该内容的核心。
``` javaScript
syncEllipsis() {
    const { ellipsisText, isEllipsis, expanded } = this.state;
    const { rows } = this.getEllipsis();
    const { children } = this.props;
    if (!rows || rows < 0 || !this.content || expanded) return;

    // Do not measure if css already support ellipsis
    if (this.canUseCSSEllipsis()) return;

    warning(
      toArray(children).every((child: React.ReactNode) => typeof child === 'string'),
      'Typography',
      '`ellipsis` should use string as children only.',
    );

    const { content, text, ellipsis } = measure(
      findDOMNode(this.content),
      rows,
      children,
      this.renderOperations(true),
      ELLIPSIS_STR,
    );
    if (ellipsisText !== text || isEllipsis !== ellipsis) {
      this.setState({ ellipsisText: text, ellipsisContent: content, isEllipsis: ellipsis });
    }
  }
```

通过 canUseCSSEllipsis 方法来判读是否可以通过现有的浏览器支持的 css 样式来满足，如果不满足使用 measure 方法。

measure 是一个关键的方法。
> measure 里面这个方法就是获得最大可以展示的字。
```javaScript
function measureText(
    textNode: Text,
    fullText: string,
    startLoc = 0,
    endLoc = fullText.length,
    lastSuccessLoc = 0,
  ): MeasureResult {
    const midLoc = Math.floor((startLoc + endLoc) / 2);
    const currentText = fullText.slice(0, midLoc);
    textNode.textContent = currentText;

    // 通过二分法，指针位置改变，递归实现后 在去找最大的展示字符数。
    if (startLoc >= endLoc - 1) {
      // Loop when step is small
      for (let step = endLoc; step >= startLoc; step -= 1) {
        const currentStepText = fullText.slice(0, step);
        textNode.textContent = currentStepText;

        if (inRange()) {
          return step === fullText.length
            ? {
                finished: false,
                reactNode: fullText,
              }
            : {
                finished: true,
                reactNode: currentStepText,
              };
        }
      }
    }

    if (inRange()) {
      return measureText(textNode, fullText, midLoc, endLoc, midLoc);
    }
    return measureText(textNode, fullText, startLoc, midLoc, lastSuccessLoc);
  }
```
通过循环便利 childNode 来得到最大放入的字符数
 通过 nodeType 来判断是 nodeType === 3 是文本类型 1 是代表元素
```javaScript
function measureNode(childNode: ChildNode, index: number): MeasureResult {
    const type = childNode.nodeType;

    if (type === ELEMENT_NODE) {
      // We don't split element, it will keep if whole element can be displayed.
      appendChildNode(childNode);
      if (inRange()) {
        return {
          finished: false,
          reactNode: contentList[index],
        };
      }

      // Clean up if can not pull in
      ellipsisContentHolder.removeChild(childNode);
      return {
        finished: true,
        reactNode: null,
      };
    }
    if (type === TEXT_NODE) {
      const fullText = childNode.textContent || '';
      const textNode = document.createTextNode(fullText);
      appendChildNode(textNode);
      return measureText(textNode, fullText);
    }

    // Not handle other type of content
    // PS: This code should not be attached after react 16
    return {
      finished: false,
      reactNode: null,
    };
  }
```