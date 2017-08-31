import { ifElse } from '../';

describe('ifElse', () => {
  test('returns a function', () => {
    expect(typeof ifElse(true)).toBe('function');
  });

  test('the condition can be a function', () => {
    const ifTrue = ifElse(() => true);
    const result = ifTrue('true', 'false');
    expect(result).toBe('true');
  });

  test('when true, returns the first argument', () => {
    const ifTrue = ifElse(true);
    const result = ifTrue('true', 'false');
    expect(result).toBe('true');
  });

  test('when false, returns the second argument', () => {
    const ifFalse = ifElse(false);
    const result = ifFalse('true', 'false');
    expect(result).toBe('false');
  });

  test('when true, can call a function if given as parameter', () => {
    const ifTrue = ifElse(true);
    const functionMock = jest.fn();
    ifTrue(functionMock('true'), functionMock('false'));
    expect(functionMock.mock.calls[0][0]).toBe('true');
  });

  test('when false, can call a function if given as parameter', () => {
    const ifFalse = ifElse(false);
    const functionMock = jest.fn();
    ifFalse('true', functionMock('called'));
    expect(functionMock.mock.calls[0][0]).toBe('called');
  });
});
