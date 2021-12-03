import { boolean, constEnum, number, string } from '.';
import assertType from '../test/assertType';
import pattern from './pattern';

describe('pattern', () => {
  it('can match input in correct order', () => {
    const match = pattern
      .on(constEnum(['success'] as const), () => true)
      .on(string, (s) => s)
      .on(number, (n) => n)
      .on(boolean, (b) => b);

    assertType<string>(match('hello'));
    expect(match('hello')).toBe('hello');

    assertType<boolean>(match('success'));
    expect(match('success')).toBe(true);
  });
});
