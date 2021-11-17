import BadInputError from '../BadInputError';
import Validator from '../Validator';

export default class NumberValidator extends Validator<number> {
  validate<I = unknown>(this: Validator<number>, input: I): number {
    if (typeof input === 'number') {
      return input;
    }

    throw new BadInputError();
  }
}
