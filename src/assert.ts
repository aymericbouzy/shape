import Validator from './Validator';

export default function assert<U, T extends U>(
  validator: Validator<T>,
  value: U,
): asserts value is T {
  validator.validate(value);
}
