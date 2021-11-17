import BadInputError from '../BadInputError';
import Validator from '../Validator';

export default class ArrayValidator<T> implements Validator<T[]> {
  constructor(private validator: Validator<T>) {}

  validate(input: unknown) {
    if (Array.isArray(input)) {
      return input.map((value) => this.validator.validate(value));
    }

    throw new BadInputError();
  }
}
