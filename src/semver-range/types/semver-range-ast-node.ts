export interface AstNode<GType extends string> {
  readonly type: GType;
}

export type SemVerRangeAstNode =
  | SemVerRangeUnionAstNode
  | SemVerRangeIntersectionAstNode
  | SemVerRangeHyphenatedAstNode
  | SemVerRangeSimpleAstNode
  | SemVerRangeShortcutAstNode;

export interface SemVerRangeUnionAstNode extends AstNode<'union'> {
  readonly ranges: readonly any[];
}

export interface SemVerRangeIntersectionAstNode extends AstNode<'intersection'> {
  readonly ranges: readonly (SemVerRangeSimpleAstNode | SemVerRangeShortcutAstNode)[];
}

export interface SemVerRangeHyphenatedAstNode extends AstNode<'hyphenated'> {
  readonly left: PartialSemVer;
  readonly right: PartialSemVer;
}

export type SemVerRangeSimpleAstNodeOperator = '=' | '>' | '<' | '>=' | '<=';

export interface SemVerRangeSimpleAstNode extends AstNode<'simple'> {
  readonly operator: '' | SemVerRangeSimpleAstNodeOperator;
  readonly semver: PartialSemVer;
}

export type SemVerRangeShortcutAstNodeOperator = '~' | '^';

export interface SemVerRangeShortcutAstNode extends AstNode<'shortcut'> {
  readonly operator: SemVerRangeShortcutAstNodeOperator;
  readonly semver: PartialSemVer;
}

export type PartialSemVerWildcard = '*' | 'x';
export type PartialSemVerWildcardOrUndefined = PartialSemVerWildcard | undefined;
export type PartialSemVerNumberOrWildcard = number | PartialSemVerWildcard;
export type PartialSemVerNumberOrWildcardOrUndefined = number | PartialSemVerWildcardOrUndefined;

export interface PartialSemVer {
  readonly major: PartialSemVerNumberOrWildcard;
  readonly minor: PartialSemVerNumberOrWildcardOrUndefined;
  readonly patch: PartialSemVerNumberOrWildcardOrUndefined;
  readonly prerelease: string | undefined;
  readonly build: string | undefined;
}
