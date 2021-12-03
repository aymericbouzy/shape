import Validator from './Validator';

type Pattern = {
  on<P extends Pattern, T, U>(
    this: P,
    validator: Validator<T>,
    match: (arg: T) => U,
  ): P & { (arg: T): U };
};

const pattern: Pattern = {
  on<T, U>(validator: Validator<T>, match: (arg: T) => U) {
    return makePattern(
      () => {
        throw new Error('No match found');
      },
      validator,
      match,
    );
  },
};

function makePattern<P extends Pattern, T, U>(
  pattern: (arg: unknown) => never,
  validator: Validator<T>,
  match: (arg: T) => U,
): P & { (arg: T): U } {
  const newPattern: any = (input: unknown) => {
    try {
      return pattern(input);
    } catch {
      return match(validator.validate(input));
    }
  };

  newPattern.on = <T, U>(validator: Validator<T>, match: (arg: T) => U) =>
    makePattern(newPattern, validator, match);

  return newPattern;
}

export default pattern;
