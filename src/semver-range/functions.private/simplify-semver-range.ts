import {
  PartialSemVer,
  SemVerRangeAstNode,
  SemVerRangeHyphenatedAstNode,
  SemVerRangeIntersectionAstNode,
  SemVerRangeShortcutAstNode,
  SemVerRangeSimpleAstNode,
  SemVerRangeUnionAstNode,
} from '../types/semver-range-ast-node.js';

/**
 * @deprecated
 */
export function simplifySemVerRange(input: SemVerRangeAstNode): SemVerRangeAstNode {
  switch (input.type) {
    case 'union':
      return simplifySemVerUnionRange(input);
    case 'intersection':
      return simplifySemVerIntersectionRange(input);
    case 'hyphenated':
      return simplifySemVerHyphenatedRange(input);
    case 'simple':
      return simplifySemVerSimpleRange(input);
    case 'shortcut':
      return simplifySemVerShortcutRange(input);
  }
}

function simplifySemVerUnionRange(input: SemVerRangeUnionAstNode): SemVerRangeAstNode {
  // TODO
  if (input.ranges.length === 1) {
    return simplifySemVerRange(input.ranges[0]);
  } else {
    return input;
  }
}

function simplifySemVerIntersectionRange(
  input: SemVerRangeIntersectionAstNode,
): SemVerRangeAstNode {
  // TODO
  if (input.ranges.length === 1) {
    return simplifySemVerRange(input.ranges[0]);
  } else {
    return input;
  }
}

function simplifySemVerHyphenatedRange(input: SemVerRangeHyphenatedAstNode): SemVerRangeAstNode {
  throw 'TODO';
}

function simplifySemVerSimpleRange({
  operator,
  semver,
}: SemVerRangeSimpleAstNode): SemVerRangeAstNode {
  if (operator === '=') {
    return {
      type: 'simple',
      operator: '',
      semver: simplifyPartialSemVer(semver),
    } satisfies SemVerRangeSimpleAstNode;
  } else {
    return {
      type: 'simple',
      operator: operator,
      semver: simplifyPartialSemVer(semver),
    } satisfies SemVerRangeSimpleAstNode;
  }
}

function simplifySemVerShortcutRange(input: SemVerRangeShortcutAstNode): SemVerRangeAstNode {
  // TODO
  switch (input.operator) {
    case '~':
      return {
        type: 'intersection',
        ranges: [],
      };
    case '^':
      return {
        type: 'intersection',
        ranges: [],
      };
  }
}

function simplifyPartialSemVer({
  major,
  minor,
  patch,
  prerelease,
  build,
}: PartialSemVer): PartialSemVer {
  if (major === '*') {
    major = 'x';
  }

  if (minor === '*') {
    minor = 'x';
  }

  if (patch === '*') {
    patch = 'x';
  }

  // if (prerelease === undefined && build === undefined) {
  //   if (patch === 'x') {
  //     patch = undefined; // can be removed
  //     if (minor === 'x') {
  //       minor = undefined; // can be removed
  //
  //       if (major === 'x') {
  //         major = '*'; // any
  //       }
  //     }
  //   }
  // }

  return {
    major,
    minor,
    patch,
    build,
    prerelease,
  };
}
