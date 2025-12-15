type DeepReadonly<T> =
  T extends (...args: any[]) => infer R
    ? (...args: any[]) => DeepReadonly<R>
    : T extends readonly (infer U)[]
      ? ReadonlyArray<DeepReadonly<U>>
      : T extends object
        ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
        : T;

export type FrozenObject<T> = DeepReadonly<T> & T;