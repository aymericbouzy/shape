import Assertor from '../Assertor';

export type Enum = readonly [...any[]];

type Union<T extends Enum> = T extends readonly [infer U, ...infer V]
  ? U | Union<V>
  : T extends readonly [infer V]
  ? V
  : never;

export default class EnumAssertor<E extends Enum> extends Assertor<Union<E>> {
  constructor(private tuple: E) {
    super();
  }

  is(input: unknown): input is Union<E> {
    return this.tuple.includes(input as E);
  }
}
