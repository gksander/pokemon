export function isNotNull<T>(x: T): x is Exclude<T, null> {
  return x !== null;
}
