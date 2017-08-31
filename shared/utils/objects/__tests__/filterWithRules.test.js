import { filterWithRules } from '../';

describe('filterWithRules', () => {
  test('throws an exception if rules argument is not an object', () => {
    const rules = 'something else';
    const obj = { a: 1, b: 2 };
    expect(() => filterWithRules(rules, obj)).toThrowError(
      'Filter set an "allow" on path "0", however, this path was not found on the source object.',
    );
  });

  test('throws an exception if the object to filter is not an object', () => {
    const filterRules = { a: true };
    const obj = 'something else';
    expect(() => filterWithRules(filterRules, obj)).toThrowError(
      'Filter set an "allow" on path "a", however, this path was not found on the source object.',
    );
  });

  test("throws an exception if the rule doesn't match the object", () => {
    const filterRules = { a: { something: true }, b: true };
    const obj = { a: 1, b: 2 };
    expect(() => filterWithRules(filterRules, obj)).toThrowError(
      'Expected prop at path "a" to be an object',
    );
  });

  test('applies filter rules on nested objects', () => {
    const filterRules = { a: { something: true }, b: true };
    const obj = { a: { something: 1 }, b: 2 };
    expect(filterWithRules(filterRules, obj)).toEqual({
      a: { something: 1 },
      b: 2,
    });
  });

  test('applies filter rules to an object', () => {
    const filterRules = { a: true, b: false };
    const obj = { a: 1, b: 2 };
    expect(filterWithRules(filterRules, obj)).toEqual({ a: 1 });
  });
});
