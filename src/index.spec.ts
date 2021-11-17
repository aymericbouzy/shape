import { array, boolean, number, object, string } from '.';
import assertType from '../test/assertType';
import BadInputError from './BadInputError';

it('can validate a string', () => {
  const validator = string();

  expect(() => validator.validate(undefined)).toThrow(BadInputError);
  expect(() => validator.validate(null)).toThrow(BadInputError);
  expect(() => validator.validate(0)).toThrow(BadInputError);
  expect(() => validator.validate({})).toThrow(BadInputError);
  expect(validator.validate('')).toBe('');
});

it('can validate a number', () => {
  const validator = number();

  expect(() => validator.validate(undefined)).toThrow(BadInputError);
  expect(() => validator.validate(null)).toThrow(BadInputError);
  expect(() => validator.validate('')).toThrow(BadInputError);
  expect(() => validator.validate({})).toThrow(BadInputError);
  expect(validator.validate(0)).toBe(0);
});

it('can validate a boolean', () => {
  const validator = boolean();

  expect(() => validator.validate(undefined)).toThrow(BadInputError);
  expect(() => validator.validate(null)).toThrow(BadInputError);
  expect(() => validator.validate('')).toThrow(BadInputError);
  expect(() => validator.validate({})).toThrow(BadInputError);
  expect(() => validator.validate(0)).toThrow(BadInputError);
  expect(validator.validate(true)).toBe(true);
});

it('can validate an object', () => {
  const validator = object({ name: string() });

  expect(() => validator.validate(undefined)).toThrow(BadInputError);
  expect(() => validator.validate(null)).toThrow(BadInputError);
  expect(() => validator.validate('')).toThrow(BadInputError);
  expect(() => validator.validate({})).toThrow(BadInputError);
  expect(() => validator.validate({ name: 0 })).toThrow(BadInputError);
  expect(() => validator.validate({ name: null })).toThrow(BadInputError);
  expect(() => validator.validate({ firstName: 'Aymeric' })).toThrow(
    BadInputError,
  );

  const validated = validator.validate({ name: 'Aymeric' });
  expect(validated).toEqual({ name: 'Aymeric' });
  assertType<string>(validated.name);
});

it('can validate an array', () => {
  const validator = array(string());

  expect(() => validator.validate(undefined)).toThrow(BadInputError);
  expect(() => validator.validate(null)).toThrow(BadInputError);
  expect(() => validator.validate('')).toThrow(BadInputError);
  expect(() => validator.validate({})).toThrow(BadInputError);

  expect(validator.validate([])).toEqual([]);
  assertType<string[]>(validator.validate([]));

  expect(() => validator.validate([false])).toThrow(BadInputError);
  expect(() => validator.validate([false, ''])).toThrow(BadInputError);
  expect(() => validator.validate(['', false])).toThrow(BadInputError);

  expect(validator.validate([''])).toEqual(['']);
  expect(validator.validate(['hello', 'world'])).toEqual(['hello', 'world']);
});
