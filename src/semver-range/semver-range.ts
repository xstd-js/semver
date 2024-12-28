import { SemVer } from '../semver/semver.js';
import { SemVerInput } from '../semver/types/semver-input.js';
import { parseSemVerRange } from './functions.private/parse-semver-range.js';

import { serializeSemVerRange } from './functions.private/serialize-semver-range.js';
import { testSemVerRange } from './functions.private/test-semver-range.js';
import { SemVerRangeAstNode } from './types/semver-range-ast-node.js';
import { SemVerRangeInput } from './types/semver-range-input.js';

/**
 * A class to parse and manage semver ranges.
 *
 * @inheritDoc https://devhints.io/semver
 * @inheritDoc https://jubianchi.github.io/semver-check
 */
export class SemVerRange {
  static of(input: SemVerRangeInput): SemVerRange {
    if (input instanceof SemVerRange) {
      return input;
    } else {
      return new SemVerRange(input);
    }
  }

  readonly #ast: SemVerRangeAstNode;

  constructor(input: SemVerRangeInput) {
    if (typeof input === 'string') {
      this.#ast = parseSemVerRange(input);
    } else {
      this.#ast = input.ast;
    }
  }

  get ast(): SemVerRangeAstNode {
    return this.#ast;
  }

  /**
   * Tests if `input` is inside this SemVerRange.
   *
   * @param input The semver to test.
   * @returns Returns `true` if the `input` is inside this `SemVerRange`.
   */
  test(input: SemVerInput): boolean {
    return testSemVerRange(this.ast, SemVer.of(input));
  }

  /**
   * Converts this SemVerRange to a valid semver range string.
   */
  toString(): string {
    return serializeSemVerRange(this.ast);
  }
}
