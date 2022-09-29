/** 特殊类型 **/

// * any 类型与任何类型的交叉都是 any，也就是 1 & any 结果是 any。

type IsAny<T> = 1 extends 0 & T ? true : false;

type IsAnyResult = IsAny<any>;
//   ^?

type IsAnyResult2 = IsAny<'x'>;
//   ^?

// * 特殊情况: isEqual

type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false;

// * IsUnion: 利用 union 类型根据它遇到条件类型时会分散成单个传入做计算的特性

type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never;

// * 如果条件类型左边是类型参数，并且传入的是 never，那么直接返回 never：
type TestNever<T> = T extends number ? 1 : 2;

// * 如果类型参数为 any，会直接返回 trueType 和 falseType 的合并：
type TestAny<T> = T extends number ? 1 : 2;
type TestAnyResult = TestAny<any>;

// * IsNever
type IsNever<T> = [T] extends [never] ? true : false;

// * IsTuple
// * 元组类型也是数组类型，但每个元素都是只读的，并且 length 是数字字面量，而数组的 length 是 number。
// type IsTuple<T> = T extends any[] ? (T extends [any, ...any[]] ? true : false) : false;
type IsTuple<T> = T extends readonly [...params: infer P]
  ? NotEqual<P['length'], number>
  : false;

type IsTupleResult = IsTuple<[1, 2]>;
//   ^?

type NotEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T
>() => T extends B ? 1 : 2
  ? false
  : true;

// * UnionToIntersection
// * 如果允许父类型赋值给子类型，就叫做逆变。如果允许子类型赋值给父类型，就叫做协变。

// * U extends U 是为了触发联合类型的 distributive 的性质，让每个类型单独传入做计算，最后合并。利用 U 做为参数构造个函数，通过模式匹配取参数的类型。
type UnionToIntersection<U> = (
  U extends U ? (x: U) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never;

type UnionToIntersectionResult = UnionToIntersection<
  //   ^?
  | {
      a: 1;
    }
  | {
      b: 2;
    }
>;

// * GetOptional

/**
 * 可选的意思是这个索引可能没有，
 * 没有的时候，那 Pick<Obj, Key> 就是空的，
 * 所以 {} extends Pick<Obj, Key> 就能过滤出可选索引。(取出索引之后，判断空对象是否是其子类型)
 *
 */
type GetOptional<Obj extends Record<string, any>> = {
  [Key in keyof Obj as {} extends Pick<Obj, Key> ? Key : never]: Obj[Key];
};

type GetOptionalResult = GetOptional<{
  // ^?
  a: number;
  b?: string;
}>;

// * GetRequired

type GetRequired<Obj extends Record<string, any>> = {
  [Key in keyof Obj as IsRequired<Key, Obj>]: Obj[Key];
};

type IsRequired<Key extends keyof Obj, Obj> = {} extends Pick<Obj, Key>
  ? never
  : Key;

type GetRequiredResult = GetRequired<{ a: number; b?: string }>;
//   ^?

// * RemoveIndexSignature
// * 索引签名不能构造成字符串字面量类型，因为它没有名字，而其他索引可以。

type X = {
  [key: string]: any;
  eat(): void;
};

type RemoveIndexSignature<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Key extends `${infer Str}` ? Str : never]: Obj[Key];
};

type RemoveIndexSignatureResult = RemoveIndexSignature<X>;
//   ^?

// * ClassPublicProps
// * keyof 只能拿到 class 的 public 索引，private 和 protected 的索引会被忽略。

class XLS {
  public name: string;
  protected age: number;
  private hobbies: string[];

  constructor() {
    this.name = 'xls';
    this.age = 20;
    this.hobbies = ['sleep', 'eat'];
  }
}

type ClassPublicProps<Obj extends Record<string, any>> = {
  [Key in keyof Obj]: Obj[Key];
};

type ClassPublicPropsResult = ClassPublicProps<XLS>;
//   ^?

// * as const
// * 默认推导出来的不是字面量类型，加上 as const 可以推导出字面量类型，但带有 readonly 修饰，这样模式匹配的时候也得加上 readonly 才行。
export {};
