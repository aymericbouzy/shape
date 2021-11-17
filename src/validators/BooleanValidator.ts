import BadInputError from '../BadInputError';
import Validator from '../Validator';

export default class BooleanValidator extends Validator<boolean> {
  validate(this: Validator<boolean>, input: unknown): boolean {
    if (typeof input === 'boolean') {
      return input;
    }

    throw new BadInputError();
  }
}