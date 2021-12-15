import BadInputError from '../BadInputError';
import Validator from '../Validator';

export type Pojo = { [key: string]: unknown };

export type ValidatorShape<T extends { [key: string]: unknown }> = {
  [key in keyof T]: Validator<T[key]>;
};

export default class ObjectValidator<
  T extends { [key: string]: unknown },
> extends Validator<T> {
  constructor(private shape: ValidatorShape<T>) {
    super();
  }

  validate(input: unknown): T {
    if (typeof input !== 'object') {
      throw new BadInputError();
    }
    if (input === null) {
      throw new BadInputError();
    }

    // @ts-ignore
    const output: T = {};

    for (const key of Object.keys(this.shape)) {
      // @ts-ignore
      output[key] = this.shape[key].validate(input[key] as unknown);
    }

    return output;
  }
}
