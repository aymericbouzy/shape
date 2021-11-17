import StringValidator from './validators/StringValidator';
import NumberValidator from './validators/NumberValidator';
import ObjectValidator, { ObjectShape } from './validators/ObjectValidator';
import ArrayValidator from './validators/ArrayValidator';
import Validator from './Validator';

export const string = () => new StringValidator();
export const number = () => new NumberValidator();
export const object = <T extends { [key: string]: unknown }>(
  shape: ObjectShape<T>,
) => new ObjectValidator(shape);
export const array = <T>(validator: Validator<T>) =>
  new ArrayValidator(validator);
