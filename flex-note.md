

### 弹性盒布局 / 弹性盒模型 / flex 布局 ...

弹性盒的作用：

解决元素的排列问题（移动端或者流式布局）排排坐吃果果。

弹性盒的兼容问题：

1. 弹性盒子在IE中有一小部分的兼容不同，在其他浏览器也是如此，需要加上前缀

2. 弹性盒有两个版本display:box; display:flex; 有的浏览器只支持box版本，开发新版本之后利用autoprefixer工具来处理兼容。

> 注意，使用了弹性盒子之后，盒模型就变成了弹性盒模型了，就和标准盒模型有很多区别了，又成一个体系。

#### 弹性盒语法学习

> [参考文献](https://blog.csdn.net/whqet/article/details/45154977)

下图是弹性盒模型的图片

![弹性盒模型](https://img-blog.csdn.net/20150425083846751)

因为我们要解决的是子元素在父元素中的排列问题，所以弹性盒使用的第一步就是为父元素添加 display:flex; 属性，添加之后，父元素就变成弹性父元素，里面的子元素变成了弹性子元素（跟后代无关）, 而且弹性子元素还可以添加 display:flex变成弹性父元素 ...

弹性盒模型中我们要明白几个新概念，弹性盒模型形成之后，伴随着会生成两个轴(主轴和侧轴)，元素排列都是按照轴排列，通过控制轴来进行子元素排列

弹性子元素会按照主轴排列，主轴默认的方向是水平方向

还有四个属性：main-start main-end （描述主轴的开始方法和结束方向）cross-start cross-end （描述侧轴的开始方法和结束方向），控制元素排列的时候可以让元素根据某几个点来排列

弹性父元素有这样的几个属性：

1. flex-direction 调整主轴的方向

    row （主轴水平 默认）、row-reverse （水平，从右边开始）、column （主轴垂直）、column-reverse（垂直 ，从下边开始）

2. flex-wrap 当子元素的主轴上的尺寸加起来已经超过父元素主轴上的尺寸，控制是否需要换行，不换行需要压缩子元素的尺寸

    no-wrap （不换行 默认） 、wrap （换行）、wrap-reverse （换行并且反转侧轴）

3. flex-flow 是direction和wrap的复合属性  column 

4. justify-content 控制子元素在主轴上的排列方式

    flex-start (子元素在主轴开始位置排列 默认) 、
    flex-end (子元素在主轴结束位置排列)、
    center (子元素在主轴中间位置排列)、
    space-between (左右两头各一个，中间的隔开排)、
    space-around

5. align-items 控制子元素在侧轴上的排列方式
    flex-start、flex-end、center、
    baseline ( 子元素在侧轴上以文字基线为标准排列 )、
    stretch ( 子元素没有高度的时候，会扩展子元素的高度到容器。。 )

6. align-content 控制换行之后，多个行之间的排列方式
    stretch( 子元素没有高度的时候，会扩展子元素的高度到容器。。 )、
	flex-start、
	flex-end、
	center、
	space-between
	space-around


弹性子元素有这样的几个属性：

1. order 给子元素排序

    子元素默认值为0，当子元素的order值相同的时候，排列按照html的顺序排, order值小的排前面

2. flex-grow 控制子元素占用剩余空间

    默认值为0, 
	
	子元素的占用 = 全部剩余空间 / 所有子元素的flex-grow的值 * 当前子元素的flex-grow

3. flex-shrink 决定某个子元素相对于其他普通子元素的收缩大小。

	默认值为 1，如果设置为0，则不收缩。 

	子元素的收缩 = 全部超出空间 / 所有子元素的flex-shrink的值 * 当前子元素的flex-shrink

4. flex  是flex-grow 和 flex-shrink的符合属性

    flex: 1 1;

5. align-self 控制单个的子元素脱离其他的子元素自己在侧轴方向上的排列方式

    值就是align-items的值