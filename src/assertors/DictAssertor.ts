import Assertor from '../Assertor';

export default class DictAssertor<V> extends Assertor<{ [key: string]: V }> {
  constructor(private readonly assertor: Assertor<V>) {
    super();
  }

  is(input: unknown): input is { [key: string]: V } {
    return (
      typeof input === 'object' &&
      input !== null &&
      Object.values(input).every((value) => this.assertor.is(value))
    );
  }
}
