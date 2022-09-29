/**
 * 模式匹配做提取，重新构造做变换。
 * 递归复用做循环，数组长度做计数。
 * 联合分散可简化，特殊特性要记清。
 * 基础扎实套路熟，类型体操可通关。
 *
 */
type ParseQueryString<Str extends string> =
  Str extends `${infer Param}&${infer Rest}`
    ? MergeParams<ParseParam<Param>, ParseQueryString<Rest>>
    : ParseParam<Str>;

type ParseParam<Param extends string> =
  Param extends `${infer key}=${infer Value}`
    ? {
        [K in key]: Value;
      }
    : {};

type MergeParams<
  OneParam extends Record<string, any>,
  OtherParam extends Record<string, any>
> = {
  [Key in keyof OneParam | keyof OtherParam]: Key extends keyof OneParam
    ? Key extends keyof OtherParam
      ? MergeValues<OneParam[Key], OtherParam[Key]>
      : OneParam[Key]
    : Key extends keyof OtherParam
    ? OtherParam[Key]
    : never;
};

type MergeValues<One, Other> = One extends Other
  ? One
  : Other extends unknown[]
  ? [One, ...Other]
  : [One, Other];

type Result = ParseQueryString<'a=1&b=2&c=3&d=4&d=5&d=6'>;
//   ^?
