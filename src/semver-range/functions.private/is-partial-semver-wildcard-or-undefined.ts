import { PartialSemVerWildcardOrUndefined } from '../types/semver-range-ast-node.js';
import { isPartialSemVerWildcard } from './is-partial-semver-wildcard.js';

export function isPartialSemVerWildcardOrUndefined(
  input: unknown,
): input is PartialSemVerWildcardOrUndefined {
  return isPartialSemVerWildcard(input) || input === undefined;
}
