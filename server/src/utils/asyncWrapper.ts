type AsyncResult<T, E = Error> = [E | undefined, T | undefined];

const asyncWrapper = <T>(promise: Promise<T>): Promise<AsyncResult<T>> =>
  promise.then((data: T): AsyncResult<T> => [undefined, data]).catch((error: Error): AsyncResult<T> => [error, undefined]);

export default asyncWrapper;
