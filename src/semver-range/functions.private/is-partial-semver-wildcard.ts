import { PartialSemVerWildcard } from '../types/semver-range-ast-node.js';

export function isPartialSemVerWildcard(input: unknown): input is PartialSemVerWildcard {
  return input === '*' || input === 'x';
}
