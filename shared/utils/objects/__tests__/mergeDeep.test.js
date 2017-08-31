import { mergeDeep } from '../';

describe('mergeDeep', () => {
  test('merges deeply two objects together', () => {
    const object1 = { a: 1, b: 2, c: { a: 1, b: 2 } };
    const object2 = { a: 1, c: { c: 3 } };
    expect(mergeDeep(object1, object2)).toEqual({
      a: 1,
      b: 2,
      c: {
        a: 1,
        b: 2,
        c: 3,
      },
    });
  });

  test('the object to the right takes the priority', () => {
    const object1 = { a: 1, b: 2 };
    const object2 = { a: 1, b: 3 };
    expect(mergeDeep(object1, object2)).toEqual({
      a: 1,
      b: 3,
    });
  });

  test('returns an empty object if no args are given', () => {
    expect(mergeDeep()).toEqual({});
  });

  test('returns the only object given as arg if no other args are given', () => {
    expect(mergeDeep({ a: 1 })).toEqual({ a: 1 });
  });
});
