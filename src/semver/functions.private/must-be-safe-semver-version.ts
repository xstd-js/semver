export function mustBeSafeSemverVersion(input: number): number {
  if (!Number.isSafeInteger(input) || input < 0) {
    throw new Error('Expected positive integer.');
  }
  return input;
}
