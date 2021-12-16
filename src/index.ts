import type Validator from './Validator';
import StringAssertor from './assertors/StringAssertor';
import NumberAssertor from './assertors/NumberAssertor';
import ObjectAssertor, { AssertorShape } from './assertors/ObjectAssertor';
import ArrayAssertor from './assertors/ArrayAssertor';
import BooleanAssertor from './assertors/BooleanAssertor';
import InstanceAssertor from './assertors/InstanceAssertor';
import EnumAssertor, { Enum } from './assertors/EnumAssertor';
import TupleAssertor, { Tuple } from './assertors/TupleAssertor';
import UnknownAssertor from './assertors/UnknownAssertor';
import Assertor from './Assertor';
import ObjectValidator, {
  Pojo,
  ValidatorShape,
} from './validators/ObjectValidator';
import DictAssertor from './assertors/DictAssertor';
import ArrayValidator from './validators/ArrayValidator';
import TupleValidator from './validators/TupleValidator';

export const string = new StringAssertor();
export const number = new NumberAssertor();
export const boolean: Assertor<boolean> = new BooleanAssertor();
export const instance = <T, U>(constructor: { new (args: U): T }) =>
  new InstanceAssertor(constructor);
export const constEnum = <T extends Enum>(tuple: T) => new EnumAssertor(tuple);
export const dict = <T>(assertor: Assertor<T>) => new DictAssertor(assertor);
export const unknown = new UnknownAssertor();

export function object<T extends Pojo>(
  shape: AssertorShape<T>,
): ObjectAssertor<T>;
export function object<T extends Pojo>(
  shape: ValidatorShape<T>,
): ObjectValidator<T>;
export function object<T extends Pojo>(
  shape: ValidatorShape<T>,
): ObjectValidator<T> | ObjectAssertor<T> {
  if (
    dict(
      // @ts-ignore : we can use instanceof on abstract class
      instance<Assertor<unknown>>(Assertor),
    ).is(shape)
  ) {
    // @ts-ignore : all validators of shape are assertors
    return new ObjectAssertor(shape);
  }

  return new ObjectValidator(shape);
}

export function array<T>(assertor: Assertor<T>): Assertor<T[]>;
export function array<T>(validator: Validator<T>): Validator<T[]>;
export function array<T>(
  validator: Validator<T>,
): Validator<T[]> | Assertor<T[]> {
  // @ts-ignore : we can use instanceof on abstract class
  if (instance<Assertor<T>>(Assertor).is(validator)) {
    return new ArrayAssertor(validator);
  }

  return new ArrayValidator(validator);
}

export function tuple<T extends Tuple>(assertors: T): TupleAssertor<T>;
export function tuple<T extends Tuple>(validators: T): TupleValidator<T>;
export function tuple<T extends Tuple>(
  validators: T,
): TupleAssertor<T> | TupleValidator<T> {
  return new TupleAssertor(validators);
}
