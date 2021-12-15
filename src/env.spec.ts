import { array, boolean, constEnum, object, string } from '.';
import assertType from '../test/assertType';
import BadInputError from './BadInputError';
import { Shape } from './Validator';
import NumberValidator from './assertors/NumberAssertor';

class IntegerValidator extends NumberValidator {
  validate(input: unknown) {
    const number = super.validate(input);

    if (Math.round(number) === number) {
      return number;
    }

    throw new BadInputError();
  }
}

const integer = new IntegerValidator().acceptJSON();
const integerArray = array(integer.acceptJSON())
  .accept(string)
  .as((input) => input.split(',').filter(Boolean))
  .default([]);

it('can validate process.env', () => {
  const env = object({
    NODE_ENV: constEnum([
      'development',
      'test',
      'staging',
      'qa',
      'sandbox',
      'production',
    ] as const).default('development'),
    DB_DATABASE: string.default('service.parcel'),
    ENABLED_SHIPPER_IDS: integerArray,
    PARCEL_PACK_TTL: integer.default(300),
    PACK_FEATURE_ENABLED: boolean.acceptJSON().default(false),
  });

  expect(env.validate({})).toEqual({
    NODE_ENV: 'development',
    DB_DATABASE: 'service.parcel',
    ENABLED_SHIPPER_IDS: [],
    PARCEL_PACK_TTL: 300,
    PACK_FEATURE_ENABLED: false,
  });
  expect(env.validate({ ENABLED_SHIPPER_IDS: '' })).toMatchObject({
    ENABLED_SHIPPER_IDS: [],
  });
  expect(env.validate({ ENABLED_SHIPPER_IDS: '12345' })).toMatchObject({
    ENABLED_SHIPPER_IDS: [12345],
  });
  expect(env.validate({ ENABLED_SHIPPER_IDS: '12345,6789' })).toMatchObject({
    ENABLED_SHIPPER_IDS: [12345, 6789],
  });
  expect(() =>
    env.validate({ ENABLED_SHIPPER_IDS: '12345,6789,wrong' }),
  ).toThrow(BadInputError);
  assertType<Shape<typeof env>>(
    env.validate({ EDITOR: 'code --wait', NODE_ENV: 'qa' }),
  );
});
