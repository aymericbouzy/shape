import Assertor from '../Assertor';

export default class UnknownAssertor extends Assertor<unknown> {
  is(input: unknown): input is unknown {
    return true;
  }
}
