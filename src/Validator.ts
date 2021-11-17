export default interface Validator<T> {
  validate(this: Validator<T>, input: unknown): T;
}
