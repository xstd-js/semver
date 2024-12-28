import { compareSemVer } from '../../semver/functions.private/compare-semver.js';
import { SemVerObject } from '../../semver/types/semver-object.js';

import {
  PartialSemVer,
  SemVerRangeAstNode,
  SemVerRangeHyphenatedAstNode,
  SemVerRangeIntersectionAstNode,
  SemVerRangeShortcutAstNode,
  SemVerRangeSimpleAstNode,
  SemVerRangeSimpleAstNodeOperator,
  SemVerRangeUnionAstNode,
} from '../types/semver-range-ast-node.js';
import { isPartialSemVerWildcardOrUndefined } from './is-partial-semver-wildcard-or-undefined.js';
import { isPartialSemVerWildcard } from './is-partial-semver-wildcard.js';

export function testSemVerRange(input: SemVerRangeAstNode, semver: SemVerObject): boolean {
  switch (input.type) {
    case 'union':
      return testSemVerUnionRange(input, semver);
    case 'intersection':
      return testSemVerIntersectionRange(input, semver);
    case 'hyphenated':
      return testSemVerHyphenatedRange(input, semver);
    case 'simple':
      return testSemVerSimpleRange(input, semver);
    case 'shortcut':
      return testSemVerShortcutRange(input, semver);
  }
}

function testSemVerUnionRange(input: SemVerRangeUnionAstNode, semver: SemVerObject): boolean {
  return input.ranges.some((input: SemVerRangeAstNode): boolean => {
    return testSemVerRange(input, semver);
  });
}

function testSemVerIntersectionRange(
  input: SemVerRangeIntersectionAstNode,
  semver: SemVerObject,
): boolean {
  return input.ranges.every((input: SemVerRangeAstNode): boolean => {
    return testSemVerRange(input, semver);
  });
}

function testSemVerHyphenatedRange(
  input: SemVerRangeHyphenatedAstNode,
  semver: SemVerObject,
): boolean {
  return (
    testPartialSemVer(input.left, semver, '>=') && testPartialSemVer(input.right, semver, '<=')
  );
}

function testSemVerSimpleRange(input: SemVerRangeSimpleAstNode, semver: SemVerObject): boolean {
  return testPartialSemVer(input.semver, semver, input.operator === '' ? '=' : input.operator);
}

function testSemVerShortcutRange(input: SemVerRangeShortcutAstNode, semver: SemVerObject): boolean {
  switch (input.operator) {
    case '~': {
      if (isPartialSemVerWildcard(input.semver.major)) {
        // `major` is wildcard => matches any
        return true;
      } else if (isPartialSemVerWildcardOrUndefined(input.semver.minor)) {
        // `~1.x` => `>=1.0.0 <2.0.0-0`
        return (
          compareSemVer(semver, {
            major: input.semver.major,
            minor: 0,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) >= 0 &&
          compareSemVer(semver, {
            major: input.semver.major + 1,
            minor: 0,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) < 0
        );
      } else if (isPartialSemVerWildcardOrUndefined(input.semver.patch)) {
        // `~1.2.x` => `>=1.2.0 <1.3.0-0`
        return (
          compareSemVer(semver, {
            major: input.semver.major,
            minor: input.semver.minor,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) >= 0 &&
          compareSemVer(semver, {
            major: input.semver.major,
            minor: input.semver.minor + 1,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) < 0
        );
      } else {
        // `~1.2.3-dev.0` => `>=1.2.3-dev.0 <1.3.0-0`
        return (
          compareSemVer(semver, input.semver as SemVerObject) >= 0 &&
          compareSemVer(semver, {
            major: input.semver.major,
            minor: input.semver.minor + 1,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) < 0
        );
      }
    }
    case '^': {
      if (isPartialSemVerWildcard(input.semver.major)) {
        // `major` is wildcard => matches any
        return true;
      } else if (isPartialSemVerWildcardOrUndefined(input.semver.minor)) {
        // `^1.x` => `>=1.0.0 <2.0.0`
        return (
          compareSemVer(semver, {
            major: input.semver.major,
            minor: 0,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) >= 0 &&
          compareSemVer(semver, {
            major: input.semver.major + 1,
            minor: 0,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) < 0
        );
      } else if (isPartialSemVerWildcardOrUndefined(input.semver.patch)) {
        // `^1.2.x` => `>=1.2.0 <2.0.0`
        return (
          compareSemVer(semver, {
            major: input.semver.major,
            minor: input.semver.minor,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) >= 0 &&
          compareSemVer(semver, {
            major: input.semver.major + 1,
            minor: 0,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) < 0
        );
      } else {
        // `^1.2.3-dev.0` => `>=1.2.3-dev.0 <2.0.0`
        return (
          compareSemVer(semver, input.semver as SemVerObject) >= 0 &&
          compareSemVer(semver, {
            major: input.semver.major + 1,
            minor: 0,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) < 0
        );
      }
    }
  }
}

function testPartialSemVer(
  partialSemVer: PartialSemVer,
  semver: SemVerObject,
  operator: SemVerRangeSimpleAstNodeOperator,
): boolean {
  if (isPartialSemVerWildcard(partialSemVer.major)) {
    // `major` is wildcard => matches only is the operator may be equal
    // return operator === '=' || operator === '>=' || operator === '<=';
    switch (operator) {
      case '=':
      case '>=':
      case '<=':
        return true;
      case '>':
      case '<':
        return false;
    }
  } else if (isPartialSemVerWildcardOrUndefined(partialSemVer.minor)) {
    // `minor` is wildcard
    // => `${operator}1.x`
    switch (operator) {
      case '=': // >=1.0.0 <2.0.0-0
        return (
          compareSemVer(semver, {
            major: partialSemVer.major,
            minor: 0,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) >= 0 &&
          compareSemVer(semver, {
            major: partialSemVer.major + 1,
            minor: 0,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) < 0
        );
      case '>': // >=2.0.0
        return (
          compareSemVer(semver, {
            major: partialSemVer.major + 1,
            minor: 0,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) >= 0
        );
      case '<': // <1.0.0
        return (
          compareSemVer(semver, {
            major: partialSemVer.major,
            minor: 0,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) < 0
        );
      case '>=': // >=1.0.0
        return (
          compareSemVer(semver, {
            major: partialSemVer.major,
            minor: 0,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) >= 0
        );
      case '<=': // <2.0.0
        return (
          compareSemVer(semver, {
            major: partialSemVer.major + 1,
            minor: 0,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) < 0
        );
    }
  } else if (isPartialSemVerWildcardOrUndefined(partialSemVer.patch)) {
    // `patch` is wildcard
    // => `${operator}1.2.x`
    switch (operator) {
      case '=': // >=1.2.0 <1.3.0-0
        return (
          compareSemVer(semver, {
            major: partialSemVer.major,
            minor: partialSemVer.minor,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) >= 0 &&
          compareSemVer(semver, {
            major: partialSemVer.major,
            minor: partialSemVer.minor + 1,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) < 0
        );
      case '>': // >=1.3.0
        return (
          compareSemVer(semver, {
            major: partialSemVer.major,
            minor: partialSemVer.minor + 1,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) >= 0
        );
      case '<': // <1.2.0-0
        return (
          compareSemVer(semver, {
            major: partialSemVer.major,
            minor: partialSemVer.minor,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) < 0
        );
      case '>=': // >=1.2.0
        return (
          compareSemVer(semver, {
            major: partialSemVer.major,
            minor: partialSemVer.minor,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) >= 0
        );
      case '<=': // <1.3.0
        return (
          compareSemVer(semver, {
            major: partialSemVer.major,
            minor: partialSemVer.minor + 1,
            patch: 0,
            prerelease: undefined,
            build: undefined,
          }) < 0
        );
    }
  } else {
    const r: number = compareSemVer(semver, partialSemVer as SemVerObject);
    switch (operator) {
      case '=':
        return r === 0;
      case '>':
        return r > 0;
      case '<':
        return r < 0;
      case '>=':
        return r >= 0;
      case '<=':
        return r <= 0;
    }
  }
}

// function testSemVer(
//   semverA: ISemVer,
//   semverB: ISemVer,
//   operator: ISemVerSimpleRangeOperator,
// ): boolean {
//   const r: number = compareSemVer(semverA, semverB);
//   switch (operator) {
//     case '=':
//       return r === 0;
//     case '>':
//       return r > 0;
//     case '<':
//       return r < 0;
//     case '>=':
//       return r >= 0;
//     case '<=':
//       return r <= 0;
//   }
// }
