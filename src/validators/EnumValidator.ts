import BadInputError from '../BadInputError';
import Validator from '../Validator';

export type Tuple = readonly [...any[]];

type OrConst<T extends Tuple> = T extends readonly [infer U, ...infer V]
  ? U | OrConst<V>
  : T extends (infer V)[]
  ? V
  : never;

export default class EnumValidator<T extends Tuple> extends Validator<
  OrConst<T>
> {
  constructor(private tuple: T) {
    super();
  }

  validate(input: unknown) {
    if (this.tuple.includes(input as T)) {
      return input as OrConst<T>;
    }

    throw new BadInputError();
  }
}
