import Assertor from '../Assertor';

export default class BooleanAssertor extends Assertor<boolean> {
  is(input: unknown): input is boolean {
    return typeof input === 'boolean';
  }
}
