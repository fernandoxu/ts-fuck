/** 递归复用做循环 **/

// Promise

type DeepPromiseValueType<T> = T extends Promise<infer ValueType>
  ? DeepPromiseValueType<ValueType>
  : T;

type DeepPromiseResult = DeepPromiseValueType<
  Promise<Promise<Promise<Record<string, any>>>>
>;

// 数组

type ReverseArr<Arr extends any[]> = Arr extends [infer First, ...infer Rest]
  ? [...ReverseArr<Rest>, First]
  : Arr;

type ReverseArrResult = ReverseArr<[1, 2, 3, 4, 5]>;
//   ^?

type IsEqual<A, B> = (A extends B ? true : false) &
  (B extends A ? true : false);

type Includes<Arr extends unknown[], FindItem> = Arr extends [
  infer First,
  ...infer Rest
]
  ? IsEqual<First, FindItem> extends true
    ? true
    : Includes<Rest, FindItem>
  : false;

type IncludesResult = Includes<[1, 2, 3, 4, 5], 3>;
//   ^?

type RemoveItem<Arr extends unknown[], Item> = Arr extends [
  infer First,
  ...infer Rest
]
  ? IsEqual<First, Item> extends true
    ? RemoveItem<Rest, Item>
    : [First, ...RemoveItem<Rest, Item>]
  : Arr;

type RemoveItemResult = RemoveItem<[1, 2, 3, 4, 5, 3], 3>;
//   ^?

/**
 * 类型参数 Length 为数组长度，约束为 number。类型参数 Ele 为元素类型，默认值为 unknown。类型参数 Arr 为构造出的数组，默认值是 []。
 * 每次判断下 Arr 的长度是否到了 Length，是的话就返回 Arr，否则在 Arr 上加一个元素，然后递归构造。
 */
type BuildArray<
  Length extends number,
  Ele = unknown,
  Arr extends unknown[] = []
> = Arr['length'] extends Length ? Arr : BuildArray<Length, Ele, [...Arr, Ele]>;

type BuildArrayResult = BuildArray<10, 'a'>;
//   ^?

// 字符串

type ReplaceAll<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Left}${From}${infer Right}`
  ? `${Left}${To}${ReplaceAll<Right, From, To>}`
  : Str;

type ReplaceAllResult = ReplaceAll<'abc', 'a', 'b'>;
//   ^?

type StringToUnion<Str extends string> =
  Str extends `${infer First}${infer Rest}`
    ? First | StringToUnion<Rest>
    : never;

type StringToUnionResult = StringToUnion<'abc' | 'def'>;
//   ^?

type ReverseStr<Str extends string> = Str extends `${infer First}${infer Rest}`
  ? `${ReverseStr<Rest>}${First}`
  : Str;

type ReverseStrResult = ReverseStr<'abc'>;
//   ^?

// 对象类型

type DeepReadonly<T extends object> = {
  readonly [key in keyof T]: T[key] extends Record<
    string | number | symbol,
    unknown
  >
    ? DeepReadonly<T[key]>
    : T[key];
};

type DeepReadonlyResult = DeepReadonly<{
  a: 1;
  b: {
    c: 2;
    d: {
      e: 3;
    };
  };
}>;

let o: DeepReadonlyResult;
// o.b.d = 1; 无法为“d”赋值，因为它是只读属性。ts(2540)
