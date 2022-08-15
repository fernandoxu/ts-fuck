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

type StartsWithResult = StartsWith<'abc', 'a'>;
//   ^?
