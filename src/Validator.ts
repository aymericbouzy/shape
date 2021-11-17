export default class Validator<T> {
  optional(): Validator<T | undefined> {
    return new OptionalValidator<T>(this);
  }

  or<U>(validator: Validator<U>): Validator<T | U> {
    return new OrValidator<T, U>(this, validator);
  }

  default(defaultValue: T): Validator<T> {
    return new ValidatorWithDefault(this, defaultValue);
  }

  validate(input: unknown): T {
    /* istanbul ignore next */
    throw new Error('Not implemented');
  }
}

class OrValidator<T, U> extends Validator<T | U> {
  constructor(
    private validatorT: Validator<T>,
    private validatorU: Validator<U>,
  ) {
    super();
  }

  validate(input: unknown) {
    try {
      return this.validatorT.validate(input);
    } catch {
      return this.validatorU.validate(input);
    }
  }
}

class OptionalValidator<T> extends Validator<T | undefined> {
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

class ValidatorWithDefault<T> extends Validator<T> {
  constructor(private validator: Validator<T>, private defaultValue: T) {
    super();
  }

  validate(input: unknown) {
    if (typeof input === 'undefined') {
      return this.defaultValue;
    }

    return this.validator.validate(input);
  }
}
