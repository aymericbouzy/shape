import BadInputError from '../BadInputError';
import Validator from '../Validator';

export type Enum = readonly [...any[]];

type Union<T extends Enum> = T extends readonly [infer U, ...infer V]
  ? U | Union<V>
  : T extends readonly [infer V]
  ? V
  : never;

export default class EnumValidator<E extends Enum> extends Validator<Union<E>> {
  constructor(private tuple: E) {
    super();
  }

  validate(input: unknown) {
    if (this.tuple.includes(input as E)) {
      return input as Union<E>;
    }

    throw new BadInputError();
  }
}
