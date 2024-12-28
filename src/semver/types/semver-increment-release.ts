/**
 * The kind of increment to apply to the semver.
 */
export type SemVerIncrementRelease =
  | 'major'
  | 'premajor'
  | 'minor'
  | 'preminor'
  | 'patch'
  | 'prepatch'
  | 'prerelease';
