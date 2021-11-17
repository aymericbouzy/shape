import BadInputError from '../BadInputError';
import Validator from '../Validator';

export default class StringValidator extends Validator<string> {
  validate(this: Validator<string>, input: unknown): string {
    if (typeof input === 'string') {
      return input;
    }

    throw new BadInputError();
  }
}
