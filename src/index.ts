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

export const string = new StringAssertor();
export const number = new NumberAssertor();
export const boolean: Assertor<boolean> = new BooleanAssertor();
export const instance = <T, U>(constructor: { new (args: U): T }) =>
  new InstanceAssertor(constructor);
export const constEnum = <T extends Enum>(tuple: T) => new EnumAssertor(tuple);
export const tuple = <T extends Tuple>(validators: T) =>
  new TupleAssertor(validators);
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
      string,
      // @ts-ignore
      instance(Assertor),
    ).is(shape)
  ) {
    return new ObjectAssertor(shape);
  }

  return new ObjectValidator(shape);
}
export function array<T>(assertor: Assertor<T>) {
  return new ArrayAssertor(assertor);
}
