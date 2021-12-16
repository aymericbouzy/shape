import BadInputError from '../BadInputError';
import Validator from '../Validator';

export type Tuple = readonly [...Validator<unknown>[]];

export type ValidatedTuple<T extends Tuple> = T extends readonly [
  Validator<infer U>,
  ...infer V
]
  ? V extends Tuple
    ? [U, ...ValidatedTuple<V>]
    : []
  : [];

export default class TupleValidator<T extends Tuple> extends Validator<
  ValidatedTuple<T>
> {
  constructor(private readonly validators: T) {
    super();
  }

  validate(input: unknown): ValidatedTuple<T> {
    if (Array.isArray(input) && input.length === this.validators.length) {
      return this.validators.map((validator, index) =>
        validator.validate(input[index]),
      ) as ValidatedTuple<T>;
    }

    throw new BadInputError();
  }
}
