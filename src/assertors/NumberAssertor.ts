import Assertor from '../Assertor';

export default class NumberAssertor extends Assertor<number> {
  is(input: unknown): input is number {
    return typeof input === 'number';
  }
}
