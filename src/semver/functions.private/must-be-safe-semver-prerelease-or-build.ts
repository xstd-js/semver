export function mustBeSafeSemverPrereleaseOrBuild(input: string | undefined): string | undefined {
  if (input === undefined) {
    return undefined;
  } else {
    input = input.trim();
    return input === '' ? undefined : input;
  }
}
