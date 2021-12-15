import Assertor from '../Assertor';

export default class StringAssertor extends Assertor<string> {
  is(input: unknown): input is string {
    return typeof input === 'string';
  }
}
