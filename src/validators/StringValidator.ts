import BadInputError from '../BadInputError';
import Validator from '../Validator';

type Key = string | number | Symbol;

export default class StringValidator extends Validator<string> {
  enum<T>(properties: T): Validator<keyof T> {
    return new EnumValidator<keyof T>(Object.keys(properties) as (keyof T)[]);
  }

  validate(input: unknown): string {
    if (typeof input === 'string') {
      return input;
    }

    throw new BadInputError();
  }
}

class EnumValidator<E extends Key> extends Validator<E> {
  constructor(private properties: Key[]) {
    super();
  }

  validate(input: unknown): E {
    if (typeof input === 'string' && this.properties.includes(input)) {
      return input as E;
    }

    throw new BadInputError();
  }
}
