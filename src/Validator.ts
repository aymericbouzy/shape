import { string } from '.';

export default abstract class Validator<T> {
  optional(): Validator<T | undefined> {
    return new OptionalValidator<T>(this);
  }

  or<U>(validator: Validator<U>): Validator<T | U> {
    return new OrValidator<T, U>(this, validator);
  }

  default(defaultValue: T): Validator<T> {
    return new ValidatorWithDefault(this, defaultValue);
  }

  transform(transform: Transform): Validator<T> {
    return new TransformValidator(this, transform);
  }

  accept<U>(acceptor: Validator<U>) {
    const validator = this;
    return {
      as(transform: (input: U) => unknown): Validator<T> {
        return new AcceptValidator(validator, acceptor, transform);
      },
    };
  }

  acceptJSON(): Validator<T> {
    return this.accept(string).as((input) => JSON.parse(input));
  }

  abstract validate(input: unknown): T;
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

interface Transform {
  (input: unknown): unknown;
}

class TransformValidator<T> extends Validator<T> {
  constructor(private validator: Validator<T>, private transformFn: Transform) {
    super();
  }

  validate(input: unknown) {
    return this.validator.validate(this.transformFn(input));
  }
}

class AcceptValidator<T, U> extends Validator<T> {
  constructor(
    private readonly validator: Validator<T>,
    private readonly acceptor: Validator<U>,
    private readonly as: (input: U) => unknown,
  ) {
    super();
  }

  validate(input: unknown) {
    try {
      const accepted = this.acceptor.validate(input);
      return this.validator.validate(this.as(accepted));
    } catch {
      return this.validator.validate(input);
    }
  }
}

export type Shape<V> = V extends Validator<infer T> ? T : never;
