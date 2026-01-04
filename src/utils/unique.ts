export function unique<T>(arr: T[]): boolean {
  return new Set(arr).size === arr.length;
}
