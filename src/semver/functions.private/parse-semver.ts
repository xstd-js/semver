import { SemVerObject } from '../types/semver-object.js';

export const SEMVER_REGEXP =
  /^(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<build>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export function parseSemVer(input: string): SemVerObject {
  const match: RegExpExecArray | null = SEMVER_REGEXP.exec(input);
  if (match === null) {
    throw new Error('Malformed partial semver.');
  }

  return {
    major: Number(match.groups!.major),
    minor: Number(match.groups!.minor),
    patch: Number(match.groups!.patch),
    build: match.groups!.build,
    prerelease: match.groups!.prerelease,
  };
}
