import Assertor from '../Assertor';
import { Pojo } from '../validators/ObjectValidator';

export type AssertorShape<T extends Pojo> = {
  [key in keyof T]: Assertor<T[key]>;
};

export default class ObjectAssertor<T extends Pojo> extends Assertor<T> {
  constructor(private shape: AssertorShape<T>) {
    super();
  }

  is(input: unknown): input is T {
    return (
      typeof input === 'object' &&
      input !== null &&
      Object.entries(this.shape).every(
        <K extends keyof T>([key, assertor]: [K, Assertor<T[K]>]) =>
          assertor.is(
            // @ts-ignore
            input[key],
          ),
      )
    );
  }
}
