import { boolean } from '.';
import assertType from '../test/assertType';
import assert from './assert';
import BadInputError from './BadInputError';

describe('assert', () => {
  it('rejects values with incorrect type', async () => {
    function test(value: unknown) {
      assert(boolean, value);

      assertType<boolean>(value);
    }

    expect(() => test('reject')).toThrow(BadInputError);
    test(true);
  });
});
