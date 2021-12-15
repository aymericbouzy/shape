import BadInputError from '../BadInputError';
import Assertor from '../Assertor';

export default class ArrayAssertor<T> extends Assertor<T[]> {
  constructor(private assertor: Assertor<T>) {
    super();
  }

  is(input: unknown): input is T[] {
    return (
      Array.isArray(input) && input.every((value) => this.assertor.is(value))
    );
  }
}
