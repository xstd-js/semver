import { SemVerCompareMode } from '../types/semver-compare-mode.js';
import { SemVerObject } from '../types/semver-object.js';

export function compareSemVer(
  inputA: SemVerObject,
  inputB: SemVerObject,
  compareMode: SemVerCompareMode = 'default',
): number {
  switch (compareMode) {
    case 'main':
      return compareSemVerMain(inputA, inputB);
    case 'prerelease':
      return compareSemVerPrerelease(inputA, inputB);
    case 'build':
      return compareSemVerBuild(inputA, inputB);
    case 'default': {
      const mainCompare: number = compareSemVerMain(inputA, inputB);

      if (mainCompare === 0) {
        return compareSemVerPrerelease(inputA, inputB);
      } else {
        return mainCompare;
      }
    }
  }
}

function compareSemVerMain(inputA: SemVerObject, inputB: SemVerObject): number {
  if (inputA.major === inputB.major) {
    if (inputA.minor === inputB.minor) {
      if (inputA.patch === inputB.patch) {
        return 0;
      } else if (inputA.patch < inputB.patch) {
        return -1;
      } else {
        return 1;
      }
    } else if (inputA.minor < inputB.minor) {
      return -1;
    } else {
      return 1;
    }
  } else if (inputA.major < inputB.major) {
    return -1;
  } else {
    return 1;
  }
}

function compareSemVerPrerelease(inputA: SemVerObject, inputB: SemVerObject): number {
  // not having a prerelease is > having one
  if (inputA.prerelease === undefined) {
    if (inputB.prerelease === undefined) {
      return 0;
    } else {
      return 1;
    }
  } else {
    if (inputB.prerelease === undefined) {
      return -1;
    } else {
      return compareSemVerPrereleaseOrBuildStrings(inputA.prerelease, inputB.prerelease);
    }
  }
}

function compareSemVerBuild(inputA: SemVerObject, inputB: SemVerObject): number {
  // having a build is > not having one
  if (inputA.build === undefined) {
    if (inputB.build === undefined) {
      return 0;
    } else {
      return -1;
    }
  } else {
    if (inputB.build === undefined) {
      return 1;
    } else {
      return compareSemVerPrereleaseOrBuildStrings(inputA.build, inputB.build);
    }
  }
}

function compareSemVerPrereleaseOrBuildStrings(inputA: string, inputB: string): number {
  for (let i: number = 0; true; i++) {
    const a: string | undefined = inputA.at(i);
    const b: string | undefined = inputB.at(i);
    if (a === undefined && b === undefined) {
      return 0;
    } else if (b === undefined) {
      return 1;
    } else if (a === undefined) {
      return -1;
    } else if (a === b) {
      continue;
    } else {
      const _a: number = Number(a);
      const _b: number = Number(b);

      if (Number.isNaN(_a)) {
        // `a` string
        if (Number.isNaN(_b)) {
          // `a` and `b` strings
          if (a < b) {
            return -1;
          } else {
            return 1;
          }
        } else {
          // `a` string and `b` number
          return 1;
        }
      } else {
        // `a` number
        if (Number.isNaN(_b)) {
          // `a` number and `b` string
          return -1;
        } else {
          // `a` and `b` numbers
          if (a < b) {
            return -1;
          } else {
            return 1;
          }
        }
      }
    }
  }
}
