import type Validator from './Validator';
import StringValidator from './validators/StringValidator';
import NumberValidator from './validators/NumberValidator';
import ObjectValidator, { ObjectShape } from './validators/ObjectValidator';
import ArrayValidator from './validators/ArrayValidator';
import BooleanValidator from './validators/BooleanValidator';
import InstanceValidator from './validators/InstanceValidator';
import EnumValidator, { Tuple } from './validators/EnumValidator';

export const string = new StringValidator();
export const number = new NumberValidator();
export const boolean = new BooleanValidator();
export const object = <T extends { [key: string]: unknown }>(
  shape: ObjectShape<T>,
) => new ObjectValidator(shape);
export const array = <T>(validator: Validator<T>) =>
  new ArrayValidator(validator);
export const instance = <T, U>(constructor: { new (args: U): T }) =>
  new InstanceValidator(constructor);
export const constEnum = <T extends Tuple>(tuple: T) =>
  new EnumValidator(tuple);
