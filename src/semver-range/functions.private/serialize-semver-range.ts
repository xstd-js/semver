import {
  PartialSemVer,
  SemVerRangeAstNode,
  SemVerRangeHyphenatedAstNode,
  SemVerRangeIntersectionAstNode,
  SemVerRangeShortcutAstNode,
  SemVerRangeSimpleAstNode,
  SemVerRangeUnionAstNode,
} from '../types/semver-range-ast-node.js';

export function serializeSemVerRange(input: SemVerRangeAstNode): string {
  switch (input.type) {
    case 'union':
      return serializeSemVerUnionRange(input);
    case 'intersection':
      return serializeSemVerIntersectionRange(input);
    case 'hyphenated':
      return serializeSemVerHyphenatedRange(input);
    case 'simple':
      return serializeSemVerSimpleRange(input);
    case 'shortcut':
      return serializeSemVerShortcutRange(input);
  }
}

function serializeSemVerUnionRange(input: SemVerRangeUnionAstNode): string {
  return input.ranges.map(serializeSemVerRange).join(' || ');
}

function serializeSemVerIntersectionRange(input: SemVerRangeIntersectionAstNode): string {
  return input.ranges.map(serializeSemVerRange).join(' ');
}

function serializeSemVerHyphenatedRange(input: SemVerRangeHyphenatedAstNode): string {
  return `${serializePartialSemVer(input.left)} - ${serializePartialSemVer(input.right)}`;
}

function serializeSemVerSimpleRange(input: SemVerRangeSimpleAstNode): string {
  return `${input.operator}${serializePartialSemVer(input.semver)}`;
}

function serializeSemVerShortcutRange(input: SemVerRangeShortcutAstNode): string {
  return `${input.operator}${serializePartialSemVer(input.semver)}`;
}

function serializePartialSemVer(input: PartialSemVer): string {
  let str: string = `${input.major}`;

  if (input.minor !== undefined) {
    str += `.${input.minor}`;
  }

  if (input.patch !== undefined) {
    str += `.${input.patch}`;
  }

  if (input.prerelease !== undefined) {
    str += `-${input.prerelease}`;
  }

  if (input.build !== undefined) {
    str += `+${input.build}`;
  }

  return str;
}
