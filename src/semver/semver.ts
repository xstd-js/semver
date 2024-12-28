import { compareSemVer } from './functions.private/compare-semver.js';
import { incrementSemVer } from './functions.private/increment-semver.js';
import { mustBeSafeSemverPrereleaseOrBuild } from './functions.private/must-be-safe-semver-prerelease-or-build.js';
import { mustBeSafeSemverVersion } from './functions.private/must-be-safe-semver-version.js';
import { parseSemVer } from './functions.private/parse-semver.js';
import { serializeSemVer } from './functions.private/serialize-semver.js';
import { SemVerCompareMode } from './types/semver-compare-mode.js';
import { SemVerIncrementRelease } from './types/semver-increment-release.js';
import { SemVerInput } from './types/semver-input.js';
import { SemVerObject } from './types/semver-object.js';

/**
 * A class to parse and manage semver.
 *
 * @inheritDoc https://semver.org/
 * @inheritDoc https://github.com/npm/node-semver/blob/main/classes/semver.js
 */
export class SemVer implements SemVerObject {
  static of(input: SemVerInput): SemVer {
    if (input instanceof SemVer) {
      return input;
    } else {
      return new SemVer(input);
    }
  }

  readonly #major: number;
  readonly #minor: number;
  readonly #patch: number;
  readonly #prerelease: string | undefined;
  readonly #build: string | undefined;

  constructor(input: SemVerInput) {
    if (typeof input === 'string') {
      input = parseSemVer(input);
      this.#major = input.major;
      this.#minor = input.minor;
      this.#patch = input.patch;
      this.#prerelease = input.prerelease;
      this.#build = input.build;
    } else if (input instanceof SemVer) {
      this.#major = input.major;
      this.#minor = input.minor;
      this.#patch = input.patch;
      this.#prerelease = input.prerelease;
      this.#build = input.build;
    } else {
      this.#major = mustBeSafeSemverVersion(input.major);
      this.#minor = mustBeSafeSemverVersion(input.minor);
      this.#patch = mustBeSafeSemverVersion(input.patch);
      this.#prerelease = mustBeSafeSemverPrereleaseOrBuild(input.prerelease);
      this.#build = mustBeSafeSemverPrereleaseOrBuild(input.build);
    }
  }

  get major(): number {
    return this.#major;
  }

  get minor(): number {
    return this.#minor;
  }

  get patch(): number {
    return this.#patch;
  }

  get prerelease(): string | undefined {
    return this.#prerelease;
  }

  get build(): string | undefined {
    return this.#build;
  }

  /**
   * Compares this SemVer with the input `input`:
   * - if this semver is equal to `input`, returns `0`
   * - if this semver is greater than `input`, returns `-1`
   * - if this semver is lower than `input`, returns `1`
   *
   * @example:
   * `ǹew Semver('1.2.3').compare('1.2.4')` => `-1`
   *
   * @param input The input to compare with this SemVer.
   * @param compareMode Compares the version, the prerelease, the build, or a mix.
   */
  compare(input: SemVerInput, compareMode?: SemVerCompareMode): number {
    return compareSemVer(this, SemVer.of(input), compareMode);
  }

  /**
   * Increments this SemVer.
   *
   * @param release The kind of increment to apply.
   * @returns A new `SemVer` with the incremented version.
   */
  increment(release: SemVerIncrementRelease): SemVer {
    return new SemVer(incrementSemVer(this, release));
  }

  /**
   * Converts this SemVer to a valid semver string.
   */
  toString(): string {
    return serializeSemVer(this);
  }
}
