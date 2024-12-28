import { SemVerObject } from '../types/semver-object.js';

export function serializeSemVer(input: SemVerObject): string {
  let str: string = `${input.major}.${input.minor}.${input.patch}`;

  if (input.prerelease !== undefined) {
    str += `-${input.prerelease}`;
  }

  if (input.build !== undefined) {
    str += `+${input.build}`;
  }

  return str;
}
