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

