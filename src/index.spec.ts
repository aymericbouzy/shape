import { array, boolean, instance, number, object, string, constEnum } from '.';
import assertType from '../test/assertType';
import BadInputError from './BadInputError';

it('can validate a string', () => {
  expect(() => string.validate(undefined)).toThrow(BadInputError);
  expect(() => string.validate(null)).toThrow(BadInputError);
  expect(() => string.validate(0)).toThrow(BadInputError);
  expect(() => string.validate({})).toThrow(BadInputError);
  expect(string.validate('')).toBe('');
});

it('can validate a number', () => {
  expect(() => number.validate(undefined)).toThrow(BadInputError);
  expect(() => number.validate(null)).toThrow(BadInputError);
  expect(() => number.validate('')).toThrow(BadInputError);
  expect(() => number.validate({})).toThrow(BadInputError);
  expect(number.validate(0)).toBe(0);
});

it('can validate a boolean', () => {
  expect(() => boolean.validate(undefined)).toThrow(BadInputError);
  expect(() => boolean.validate(null)).toThrow(BadInputError);
  expect(() => boolean.validate('')).toThrow(BadInputError);
  expect(() => boolean.validate({})).toThrow(BadInputError);
  expect(() => boolean.validate(0)).toThrow(BadInputError);
  expect(boolean.validate(true)).toBe(true);
});

it('can validate an object', () => {
  const validator = object({ name: string });

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
  const validator = array(string);

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

it('can validate an optional value', () => {
  const optionalString = string.optional();

  expect(() => optionalString.validate(false)).toThrow(BadInputError);
  expect(() => optionalString.validate({})).toThrow(BadInputError);
  expect(() => optionalString.validate(0)).toThrow(BadInputError);
  expect(() => optionalString.validate(null)).toThrow(BadInputError);

  expect(optionalString.validate(undefined)).toBe(undefined);
  expect(optionalString.validate('')).toBe('');

  assertType<string | undefined>(optionalString.validate('input'));
});

it('can validate an enum', () => {
  const successOrError = constEnum(['success', 'error'] as const);

  expect(() => successOrError.validate(false)).toThrow(BadInputError);
  expect(() => successOrError.validate({})).toThrow(BadInputError);
  expect(() => successOrError.validate('info')).toThrow(BadInputError);
  expect(() => successOrError.validate('')).toThrow(BadInputError);

  expect(successOrError.validate('success')).toBe('success');
  assertType<'success' | 'error'>(successOrError.validate('success'));
});

it('can validate an or', () => {
  const stringOrNumber = string.or(number);
  expect(() => stringOrNumber.validate(false)).toThrow(BadInputError);
  expect(() => stringOrNumber.validate({})).toThrow(BadInputError);
  expect(() => stringOrNumber.validate(null)).toThrow(BadInputError);

  expect(stringOrNumber.validate('success')).toBe('success');
  expect(stringOrNumber.validate(2)).toBe(2);
  assertType<string | number>(stringOrNumber.validate('success'));

  const date = stringOrNumber
    .or(object({ $timestamp: stringOrNumber }))
    .or(object({ timestamp: stringOrNumber }));
  assertType<
    | string
    | number
    | { $timestamp: number | string }
    | { timestamp: number | string }
  >(date.validate(new Date().valueOf()));
});

it('can provide a default', () => {
  const validator = object({ numbers: array(number).default([]) });

  expect(validator.validate({})).toEqual({ numbers: [] });
  expect(validator.validate({ numbers: [0] })).toEqual({ numbers: [0] });
  expect(() => validator.validate({ numbers: ['0'] })).toThrow(BadInputError);
});

it('can accept a transform', () => {
  const date = instance(Date).from(number.or(string));
  expect(() => date.validate(false)).toThrow(BadInputError);
  expect(() => date.validate({})).toThrow(BadInputError);
  expect(date.validate(0)).toBeInstanceOf(Date);
  expect(date.validate(0)).toEqual(new Date(0));
  expect(date.validate(new Date().toISOString())).toBeInstanceOf(Date);
  assertType<Date>(date.validate(0));
});

it('can handle a real world use case', async () => {
  const input = object({
    filters: object({
      warehouseId: number.optional(),
      productIds: array(string).optional(),
    }).optional(),
    includes: array(constEnum(['parcel.pii'] as const)).optional(),
    sort: object({
      warehouseId: constEnum(['asc', 'desc'] as const).optional(),
      productId: constEnum(['asc', 'desc'] as const).optional(),
    }).optional(),
  });

  assertType<{
    filters?: {
      warehouseId?: number;
      productIds?: string[];
    };
    includes?: 'parcel.pii'[];
    sort?: {
      warehouseId?: 'asc' | 'desc';
      productId?: 'asc' | 'desc';
    };
  }>(input.validate({}));
});
