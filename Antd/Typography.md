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
