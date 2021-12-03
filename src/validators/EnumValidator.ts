import BadInputError from '../BadInputError';
import Validator from '../Validator';

export type Tuple = readonly [...any[]];

type Union<T extends Tuple> = T extends readonly [infer U, ...infer V]
  ? U | Union<V>
  : T extends readonly [infer V]
  ? V
  : never;

export default class EnumValidator<T extends Tuple> extends Validator<
  Union<T>
> {
  constructor(private tuple: T) {
    super();
  }

  validate(input: unknown) {
    if (this.tuple.includes(input as T)) {
      return input as Union<T>;
    }

    throw new BadInputError();
  }
}
