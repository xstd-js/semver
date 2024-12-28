/**
 * The different modes when comparing two semver.
 */
export type SemVerCompareMode =
  | 'main' // compares only the versions
  | 'prerelease' // compares only the prereleases
  | 'build' // compares only the build
  | 'default'; // compares the versions and prereleases
