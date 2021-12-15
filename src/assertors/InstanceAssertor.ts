import Assertor from '../Assertor';

export default class InstanceAssertor<T, U> extends Assertor<T> {
  constructor(private Instance: { new (arg: U): T }) {
    super();
  }

  from(assertor: Assertor<U>) {
    return this.accept(assertor).as((input) => new this.Instance(input));
  }

  is(input: unknown): input is T {
    return input instanceof this.Instance;
  }
}
