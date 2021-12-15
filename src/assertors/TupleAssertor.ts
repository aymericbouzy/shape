import Assertor from '../Assertor';

export type Tuple = readonly [...Assertor<unknown>[]];

export type ValidatedTuple<T extends Tuple> = T extends readonly [
  Assertor<infer U>,
  ...infer V
]
  ? V extends Tuple
    ? [U, ...ValidatedTuple<V>]
    : []
  : [];

export default class TupleAssertor<T extends Tuple> extends Assertor<
  ValidatedTuple<T>
> {
  constructor(private readonly assertors: T) {
    super();
  }

  is(input: unknown): input is ValidatedTuple<T> {
    return (
      Array.isArray(input) &&
      input.length === this.assertors.length &&
      this.assertors.every((assertor, index) => assertor.is(input[index]))
    );
  }
}
