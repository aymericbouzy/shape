import OptionalValidator from './validators/OptionalValidator';

export default class Validator<T> {
  optional(): Validator<T | undefined> {
    return new OptionalValidator<T>(this);
  }

  validate(input: unknown): T {
    throw new Error('Not implemented');
  }
}
