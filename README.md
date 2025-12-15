***TypeScript FrozenObject Type***

This repository contains a implementation to a specific TypeScript type: 
Designing a `FrozenObject<T>` type that enforces deep immutability at compile time while maintaining compatibility with existing code that expects mutable types.

The goal was to create a generic type `FrozenObject<T>` with three requirements:

1.  Deep Immutability: All properties of `T` (nested objects, arrays) must be readonly. Assignments should trigger compile-time errors.
2.  Compatibility: The type must be assignable to existing functions that expect a mutable `T`  without casting or errors.
3.  Single Type: No function overloads or conditional unions at the call.

***The Implementation***

The solution uses an Intersection Type strategy. By intersecting the original type `T` with a recursive Readonly Mapped Type, 
we satisfy both the strict safety check and the structural compatibility check.

  type DeepReadonly<T> =
    T extends (...args: any[]) => infer R
      ? (...args: any[]) => DeepReadonly<R>
      : T extends readonly (infer U)[]
        ? ReadonlyArray<DeepReadonly<U>>
        : T extends object
          ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
          : T;
  export type FrozenObject<T> = DeepReadonly<T> & T;

**Key Insight**

TypeScript cannot enforce both immutability and mutability on the same reference.
This is a fundamental limitation of structural typing.

If FrozenObject<T> were truly readonly:

frozen.prop = 123; // error
Then this would also be wrong:
function mutate(t: T) {
  t.prop = 123;
}

mutate(frozen); // error

That would break the core requirement:
FrozenObject<T> must be usable wherever T is expected
So TypeScript must allow mutation on the same reference.

What FrozenObject<T> Does
1. Preserves assignability
const frozen: FrozenObject<Config> = config;
const mutable: Config = frozen;

2. Works with existing code
updateServerInfo(frozen); 

3. Acts as a semantic marker
function processConfig(cfg: FrozenObject<Config>) {
}


 ***What FrozenObject<T> Does Not Do***
  It does NOT block mutation at compile time
  frozen.server.port = 9000; // allowed

  It does NOT freeze at runtime
  Object.isFrozen(frozen); // false

  It does NOT replace Readonly<T>
  If you need real immutability, use:
  type TrulyFrozen<T> = DeepReadonly<T>;
  but this breaks interop with mutable APIs.

  **Testing Assumptions**

  FrozenObject<T> cannot be tested using @ts-expect-error on mutations. These expectations are logically impossible and will always fail.
  Valid tests focus on:
  Assignability
  Interoperability
  Runtime behavior
  Structural compatibility

  **When should you we This?**

    Use FrozenObject<T> when:
    You want logical immutability
    You must interoperate with existing mutable code

    Do not use it if you need:
    Hard immutability guarantees
    Security boundaries
    Concurrent safety

***Prerequisites***

Node.js installed

npm or yarn

**Installation**
Clone the repository:

git clone [https://github.com/USERNAME/ts-frozen-object-test.git](https://github.com/USERNAME/ts-frozen-object-test.git)
cd ts-frozen-object-test
Install dependencies:
npm install: 

**Running Tests**
This project uses Jest with ts-jest for testing. The tests cover positive cases (reading values), negative cases (assigning values), and interoperability.

Run all tests:
npm test
Run tests in watch mode (for development):
npm run test:watch
