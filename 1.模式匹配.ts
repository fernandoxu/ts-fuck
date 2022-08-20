/** 模式匹配做提取 **/

// 模式匹配
type GetValueType<P> = P extends Promise<infer Value> ? Value : never;

type GetValueResult = GetValueType<Promise<'xls'>>;

// 数组类型
type arr = [1, 2, 3];

type GetFirst<Arr extends unknown[]> = Arr extends [infer First, ...unknown[]]
  ? First
  : never;
type GetLast<Arr extends unknown[]> = Arr extends [...unknown[], infer Last]
  ? Last
  : never;
type ShiftArr<Arr extends unknown[]> = Arr extends []
  ? []
  : Arr extends [unknown, ...infer Rest]
  ? Rest
  : never;

type GetFirstResult = GetFirst<arr>;
type GetLastResult = GetLast<arr>;
type ShiftArrResult = ShiftArr<arr>;
//   ^?

// 字符串类型
type StartsWith<
  Str extends string,
  Prefix extends string
> = Str extends `${Prefix}${string}` ? true : false;

type TrimStrRight<Str extends string> = Str extends `${infer Rest}${
  | ' '
  | '\n'
  | '\t'}`
  ? TrimStrRight<Rest>
  : Str;
type TrimStrLeft<Str extends string> = Str extends `${
  | ' '
  | '\n'
  | '\t'}${infer Rest}`
  ? TrimStrLeft<Rest>
  : Str;
type TrimStr<Str extends string> = TrimStrRight<TrimStrLeft<Str>>;

type StartsWithResult = StartsWith<'abc', 'a'>;
//   ^?
type TrimStrRightResult = TrimStrRight<'abc '>;
//   ^?
type TrimStrLeftResult = TrimStrLeft<' abc'>;
//   ^?
type TrimStrResult = TrimStr<' abc '>;
//   ^?

// 函数类型
type GetParameters<Fn extends Function> = Fn extends (
  ...args: infer Args
) => unknown
  ? Args
  : never;

type GetParametersResult = GetParameters<(a: number, b: string) => string>;
//   ^?

type GetReturnType<Fn extends Function> = Fn extends (
  ...args: any
) => infer ReturnType
  ? ReturnType
  : never;

type GetReturnTypeResult = GetReturnType<(a: number, b: string) => string>;

// 索引类型
type GetRefProps<Props> = 'ref' extends keyof Props
  ? Props extends { ref?: infer Value | undefined }
    ? Value
    : never
  : never;

type GetRefPropsResult = GetRefProps<{ ref: { x: 1 }; y: 2 }>;
//   ^?
