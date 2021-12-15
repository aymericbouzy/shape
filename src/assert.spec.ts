import { boolean } from '.';
import assertType from '../test/assertType';
import BadInputError from './BadInputError';

describe('assert', () => {
  it('rejects values with incorrect type', async () => {
    function test(value: unknown) {
      boolean.assert(value);

      assertType<boolean>(value);
    }

    expect(() => test('reject')).toThrow(BadInputError);
    test(true);
  });
});
