/** 数组长度做计数 **/

// !真够变态的

type BuildArray<
  Length extends number,
  Ele = unknown,
  Arr extends unknown[] = []
> = Arr['length'] extends Length ? Arr : BuildArray<Length, Ele, [...Arr, Ele]>;

// * 实现加法
type Add<Num1 extends number, Num2 extends number> = [
  ...BuildArray<Num1>,
  ...BuildArray<Num2>
]['length'];

type AddResult = Add<1, 2>;
//   ^?

// * 实现减法
type Subtract<
  Num1 extends number,
  Num2 extends number
> = BuildArray<Num1> extends [...BuildArray<Num2>, ...infer Rest]
  ? Rest['length']
  : never;

type SubtractResult = Subtract<9, 2>;
//   ^?

// * 实现乘法
type Multiply<
  Num1 extends number,
  Num2 extends number,
  ResultArr extends unknown[] = []
> = Num2 extends 0
  ? ResultArr['length']
  : Multiply<Num1, Subtract<Num2, 1>, [...BuildArray<Num1>, ...ResultArr]>;

type MultiplyResult = Multiply<9, 3>;
//   ^?

// * 实现除法
type Divide<
  Num1 extends number,
  Num2 extends number,
  ResultArr extends unknown[] = []
> = Num1 extends 0
  ? ResultArr['length']
  : Divide<Subtract<Num1, Num2>, Num2, [...ResultArr, unknown]>;

type DivideResult = Divide<27, 3>;
//   ^?

// * 获取字符串的长度
/**
 * 每次通过模式匹配提取去掉一个字符之后的剩余字符串，并且往计数数组里多放入一个元素。递归进行取字符和计数。
 * 如果模式匹配不满足，代表计数结束，返回计数数组的长度 CountArr['length']。
 */
type StrLen<
  Str extends string,
  CountArr extends unknown[] = []
> = Str extends `${string}${infer Rest}`
  ? StrLen<Rest, [...CountArr, unknown]>
  : CountArr['length'];

type StrLenResult = StrLen<'abcdefg'>;
//   ^?

/**
 *
 * 类型参数 Num1 和 Num2 是待比较的两个数。
 * 类型参数 CountArr 是计数用的，会不断累加，默认值是 [] 代表从 0 开始。
 * 如果 Num1 extends Num2 成立，代表相等，直接返回 false。
 * 否则判断计数数组的长度，如果先到了 Num2，那么就是 Num1 大，返回 true。
 * 反之，如果先到了 Num1，那么就是 Num2 大，返回 false。
 * 如果都没到就往计数数组 CountArr 中放入一个元素，继续递归。
 * 这样就实现了数值比较。
 */
// * 实现大于
type GreaterThan<
  Num1 extends number,
  Num2 extends number,
  CountArr extends unknown[] = []
> = Num1 extends Num2
  ? false
  : CountArr['length'] extends Num2
  ? true
  : CountArr['length'] extends Num1
  ? false
  : GreaterThan<Num1, Num2, [...CountArr, unknown]>;

type GreaterThanResult = GreaterThan<3, 4>;
//   ^?

// * 实现斐波那契数列
// 可拉倒吧这个😂
type FibonacciLoop<
  PrevArr extends unknown[],
  CurrentArr extends unknown[],
  IndexArr extends unknown[] = [],
  Num extends number = 1
> = IndexArr['length'] extends Num
  ? CurrentArr['length']
  : FibonacciLoop<
      CurrentArr,
      [...PrevArr, ...CurrentArr],
      [...IndexArr, unknown],
      Num
    >;

type Fibonacci<Num extends number> = FibonacciLoop<[1], [], [], Num>;

// 1 1 2 3 5 8 13 21 34
type FibonacciResult = Fibonacci<8>;
//   ^?
export {};
