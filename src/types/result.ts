/* eslint-disable @typescript-eslint/no-explicit-any */
class _Ok<T, E> {
  readonly _tag = "Ok";
  constructor(public readonly value: T) { }

  isOk(): this is _Ok<T, E> { return true; }
  isErr(): this is _Err<T, E> { return false; }

  unwrap(): T { return this.value; }
  unwrapOrElse(_fn: (error: E) => T): T { return this.value; }
  expect(_message: string): T { return this.value; }
}

class _Err<T, E> {
  readonly _tag = "Err";
  constructor(public readonly error: E) { }

  isOk(): this is _Ok<T, E> { return false; }
  isErr(): this is _Err<T, E> { return true; }

  unwrap(): never { throw new Error(String(this.error)); }
  unwrapOrElse(fn: (error: E) => T): T { return fn(this.error); }
  expect(message: string): never { throw new Error(`${message}: ${String(this.error)}`); }
}

/**
 * 一个代表成功或失败操作的类型。
 * T 是成功值的类型，E 是错误值的类型。
 */
export type Result<T, E> = _Ok<T, E> | _Err<T, E>;

/**
 * 创建一个代表成功的 Result
 * @param value 成功时包含的值
 */
export const Ok = <T, E = never>(value: T): Result<T, E> => new _Ok<T, E>(value);

/**
 * 创建一个代表失败的 Result
 * @param error 失败时包含的错误
 */
export const Err = <T = never, E = any>(error: E): Result<T, E> => new _Err<T, E>(error);
