import BadInputError from '../BadInputError';
import Validator from '../Validator';

export default class InstanceValidator<T, U> extends Validator<T> {
  constructor(private Instance: { new (arg: U): T }) {
    super();
  }

  from(validator: Validator<U>): Validator<T> {
    return this.transform(
      (input: unknown) => new this.Instance(validator.validate(input)),
    );
  }

  validate(input: unknown) {
    if (input instanceof this.Instance) {
      return input;
    }

    throw new BadInputError();
  }
}
