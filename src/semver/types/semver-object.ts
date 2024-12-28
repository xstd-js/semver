/**
 * An interface describing the parts of a semver.
 */
export interface SemVerObject {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly prerelease?: string | undefined;
  readonly build?: string | undefined;
}
