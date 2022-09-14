/** 联合分散可简化 **/

// ! 分布式条件类型
/**
 * 当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候
 * TypeScript 会把每一个元素单独传入来做类型运算，最后再合并成联合类型，这种语法叫做分布式条件类型。
 * */

type Union = 'a' | 'b' | 'c';
type str = `${Union}~~`;
//    ^?

type UppercaseA<Item extends string> = Item extends 'a'
  ? Uppercase<Item>
  : Item;

type UppercaseAResult = UppercaseA<'a' | 'b' | 'c'>;
//   ^?

type Camelcase<Str extends string> =
  Str extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${Camelcase<Rest>}`
    : Str;

type CamelcaseArr<Arr extends unknown[]> = Arr extends [
  infer Item,
  ...infer RestArr
]
  ? [Camelcase<Item & string>, ...CamelcaseArr<RestArr>]
  : [];

type CamelcaseArrResult = CamelcaseArr<
  //   ^?
  ['aa_bb_cc', 'what_the_fuck', 'who_are_you']
>;

type CamelcaseUnion<Item extends string> =
  Item extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${CamelcaseUnion<Rest>}`
    : Item;

type CamelcaseUnionResult = CamelcaseUnion<
  //   ^?
  'aa_bb_cc' | 'what_the_fuck' | 'who_are_you'
>;

// * 判断联合类型
/**
 * 当 A 是联合类型时：
 * A extends A 这种写法是为了触发分布式条件类型，让每个类型单独传入处理的，没别的意义。
 * A extends A 和 [A] extends [A] 是不同的处理，前者是单个类型和整个类型做判断，
 * 后者两边都是整个联合类型，因为只有 extends 左边直接是类型参数才会触发分布式条件类型。
 *
 */

type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never;
type IsUnionResult = IsUnion<'a' | 'b' | 'c'>;
//   ^?
type IsUnionResult2 = IsUnion<['a', 'b', 'c']>;
//   ^?

type TestUnion<A, B = A> = A extends A ? { a: A; b: B } : never;
type TestUnionResult = TestUnion<'a' | 'b'>;
//   ^?

type BEM<
  Block extends string,
  Element extends string[],
  Modifiers extends string[]
> = `${Block}__${Element[number]}--${Modifiers[number]}`;

type BEMResult = BEM<'x', ['aaa', 'bbb'], ['cc', 'dd']>;

// * AllCombinations 全组合

type Combination<A extends string, B extends string> =
  | A
  | B
  | `${A}${B}`
  | `${B}${A}`;

type AllCombinations<A extends string, B extends string = A> = A extends A
  ? Combination<A, AllCombinations<Exclude<B, A>>>
  : never;

type AllCombinationsResult = AllCombinations<'a' | 'b' | 'c'>;
//   ^?
