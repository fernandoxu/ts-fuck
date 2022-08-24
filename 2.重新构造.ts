/** 重新构造做变换 **/

// Tuple

type Push<Arr extends unknown[], Ele> = [...Arr, Ele];

type PushResult = Push<[1, 2, 3], 4>;
//   ^?

type Unshift<Arr extends unknown[], Ele> = [Ele, ...Arr];

type UnshiftResult = Unshift<[1, 2, 3], 0>;
//   ^?

type Zip<Arr1 extends unknown[], Arr2 extends unknown[]> = Arr1 extends [
  infer First1,
  ...infer Rest1
]
  ? Arr2 extends [infer First2, ...infer Rest2]
    ? [[First1, First2], ...Zip<Rest1, Rest2>]
    : []
  : [];

type ZipResult = Zip<[1, 2, 3], ['a', 'b', 'c']>;
//   ^?

// String

type CapitalizeStr<Str extends string> =
  Str extends `${infer First}${infer Rest}`
    ? `${Uppercase<First>}${Rest}`
    : Str;

type CapitalizeStrResult = CapitalizeStr<'abc'>;
//   ^?

type CamelCase<Str extends string> =
  Str extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
    : Str;

type CamelCaseResult = CamelCase<'foo_bar_baz'>;
//   ^?

type DropSubStr<
  Str extends string,
  SubStr extends string
> = Str extends `${infer Left}${SubStr}${infer Right}`
  ? DropSubStr<`${Left}${Right}`, SubStr>
  : Str;

type DropSubStrResult = DropSubStr<'abcabc', 'bc'>;
//   ^?

type AppendArgument<Func extends Function, Arg> = Func extends (
  ...args: infer Args
) => infer Return
  ? (...args: [...Args, Arg]) => Return
  : never;

type AppendArgumentResult = AppendArgument<(a: number) => string, number>;
//   ^?

// 索引类型

// * 使用 as 重映射
type UppercaseKeys<Obj extends object> = {
  [K in keyof Obj as Uppercase<K & string>]: Obj[K];
};

type UppercaseKeysResult = UppercaseKeys<{ aa: 1; bb: 2; c: 3 }>;
//   ^?

type FilterByValueType<T extends object, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K];
};

type FilterByValueTypeResult = FilterByValueType<
  { a: 1; b: 2; c: 3; d: 'ww' },
  number
>;
//   ^?

type ToReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

type ToMutable<T> = {
  -readonly [K in keyof T]: T[K];
};
