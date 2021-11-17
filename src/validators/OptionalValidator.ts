import Validator from '../Validator';

export default class OptionalValidator<T> extends Validator<T | undefined> {
  constructor(private validator: Validator<T>) {
    super();
  }

  validate(input: unknown) {
    if (typeof input === 'undefined') {
      return input;
    }

    return this.validator.validate(input);
  }
}
