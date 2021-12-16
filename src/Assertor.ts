import BadInputError from './BadInputError';
import Validator from './Validator';

export default abstract class Assertor<T> extends Validator<T> {
  abstract is(input: unknown): input is T;

  assert(input: unknown): asserts input is T {
    if (!this.is(input)) {
      throw new BadInputError();
    }
  }

  validate(input: unknown): T {
    this.assert(input);

    return input;
  }

  or<U>(assertor: Assertor<U>): Assertor<T | U> {
    return new OrAssertor(this, assertor);
  }

  optional(): Assertor<T | undefined> {
    return new OptionalAssertor(this);
  }
}

class OrAssertor<T, U> extends Assertor<T | U> {
  constructor(
    private readonly assertorT: Assertor<T>,
    private readonly assertorU: Assertor<U>,
  ) {
    super();
  }

  is(input: unknown): input is T | U {
    return this.assertorT.is(input) || this.assertorU.is(input);
  }
}

class OptionalAssertor<T> extends Assertor<T | undefined> {
  constructor(private assertor: Assertor<T>) {
    super();
  }

  is(input: unknown): input is T | undefined {
    return typeof input === 'undefined' || this.assertor.is(input);
  }
}
