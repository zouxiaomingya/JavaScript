TypeScript 泛型之 Omit<T, K> = Pick<T, Exclude<keyof T, K>>
首先来看这样一个 ts 例子

import { Button, ButtonProps } from './components/button'

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
type BigButtonProps = Omit<ButtonProps, 'size'>

function BigButton(props: BigButtonProps) {
  return Button({ ...props, size: 'big' })
}
复制代码
如果对这个例子很清晰，大佬请点击右上角。

如果不清楚 我们可以来往下共同探索一番。。

partial, Readonly, Record, Pick

partial
Partial 作用是将传入的属性变为可选项.

keyof, in

首先我们需要理解两个关键字 keyof 和 in, keyof 可以用来取得一个对象接口的所有 key 值.

比如

interface Foo {
  name: string;
  age: number
}

// T -> "name" | "age"
type T = keyof Foo 

type Keys = "a" | "b"
type Obj =  {
  [p in Keys]: any
} 
// Obj -> { a: any, b: any }
复制代码
keyof 产生联合类型, in 则可以遍历枚举类型, 所以他们经常一起使用, 看下 Partial 源码

type Partial<T> = { [P in keyof T]?: T[P] };
复制代码
使用

interface Foo {
  name: string;
  age: number;
}

type B = Partial<Foo>;

// 最多只能够定义 name, age 中的属性（可以不定义）
let b: B = {
  name: '1',
  age: 3,
};
复制代码
Required
Required 的作用是将传入的属性变为必选项, 源码如下

type Required<T> = { [P in keyof T]-?: T[P] };
复制代码
我们发现一个有意思的用法 -?, 这里很好理解就是将可选项代表的 ? 去掉, 从而让这个类型变成必选项. 与之对应的还有个+? , 这个含义自然与-?之前相反, 它是用来把属性变成可选项的.

Pick
从 T 中取出 一系列 K 的属性

type Pick<T, K extends keyof T> = { [P in K]: T[P] };
复制代码
小结
总结一下 Partial, Required, Pick。

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface User {
  age: number;
  name: string;
};

// 相当于: type PartialUser = { age?: number; name?: string; }
type PartialUser = Partial<User>

// 相当于: type PickUser = { age: number; name: string; }
type PickUser = Pick<User, "age" | "name">
复制代码
Exclude （排除）
在 ts 2.8 中引入了一个条件类型, 示例如下

T extends U ? X : Y
复制代码
以上语句的意思就是 如果 T 是 U 的子类型的话，那么就会返回 X，否则返回 Y

type Exclude<T, U> = T extends U ? never : T;

const str: Exclude<'a' | '1' | '2', 'a' | 'y' | 'z'> = '1';
复制代码

从代码 str 的提示，可以很好的理解，Exclude 就是将前面类型的与后面类型对比，过滤出前面独有的属性

通过使用 Pick 和 Exclude 来组合一个新的类型 Omit

Omit (省略)
// Pick
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
 
// Exclude
type Exclude<T, U> = T extends U ? never : T;

// Omit
type Omit = Pick<T, Exclude<keyof T, K>>
    
    
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

interface User {
  id: number;
  age: number;
  name: string;
}

// 相当于: type OmitUser = { age: number; name: string; }
type OmitUser = Omit<User, 'id'>;
复制代码
很好理解，去除掉 User 接口内的 id 属性。

最后
回过头看之前的代码

import { Button, ButtonProps } from './components/button'

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
type BigButtonProps = Omit<ButtonProps, 'size'>

function BigButton(props: BigButtonProps) {
  return Button({ ...props, size: 'big' })
}
复制代码
首先定义了一个 BigButtonProps 类型， 这个类型通过 Omit 除去了 size 属性。解决！！

最后
全文章，如有错误或不严谨的地方，请务必给予指正，谢谢！

参考： ts高级技巧