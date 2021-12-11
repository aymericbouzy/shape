import { number, object, string, tuple, unknown } from '.';
import pattern from './pattern';

type Options = { timeout?: number };

it('can help define a function that accepts overloads', async () => {
  const invokeInput = tuple([
    string,
    object({ timeout: number.optional() }),
    object({}),
  ] as const)
    .accept(tuple([string, object({})] as const))
    .as(([qualifier, data]) => [qualifier, {}, data]);

  function invoke<D extends object>(
    qualifier: string,
    data: D,
  ): Promise<unknown>;
  function invoke<D extends object>(
    qualifier: string,
    options: Options,
    data: D,
  ): Promise<unknown>;
  function invoke(...args: unknown[]) {
    const [qualifier, options, data] = invokeInput.validate(args);

    return Promise.resolve({ qualifier, options, data });
  }

  expect(await invoke('hello', { world: '!' })).toEqual({
    qualifier: 'hello',
    options: { timeout: undefined },
    data: { world: '!' },
  });
  expect(await invoke('hello', { timeout: 300 }, { world: '!' })).toEqual({
    qualifier: 'hello',
    options: { timeout: 300 },
    data: { world: '!' },
  });
});
