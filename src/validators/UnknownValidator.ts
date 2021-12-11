import Validator from '../Validator';

export default class UnknownValidator extends Validator<unknown> {
  validate(input: unknown): unknown {
    return input;
  }
}
