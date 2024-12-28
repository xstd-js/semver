import { describe, expect, it } from 'vitest';
import { SemVer } from './semver.js';

describe('SemVer', () => {
  describe('static methods', () => {
    describe('.of(...)', () => {
      it('should support string', () => {
        expect(SemVer.of('1.2.3').toString()).toBe('1.2.3');
      });

      it('should support another SemVer', () => {
        const semver = new SemVer('1.2.3');
        expect(SemVer.of(semver)).toBe(semver);
      });
    });
  });

  describe('construct', () => {
    describe('with valid input', () => {
      it('should construct with valid string', () => {
        const semver = new SemVer('1.2.3');

        expect(semver).toBeDefined();

        expect(semver.major).toBe(1);
        expect(semver.minor).toBe(2);
        expect(semver.patch).toBe(3);
      });

      it('should construct with valid options', () => {
        const semver = new SemVer({
          major: 1,
          minor: 2,
          patch: 3,
          prerelease: undefined,
          build: undefined,
        });

        expect(semver).toBeDefined();

        expect(semver.major).toBe(1);
        expect(semver.minor).toBe(2);
        expect(semver.patch).toBe(3);
      });

      it('should construct providing another SemVer', () => {
        const semver = new SemVer(new SemVer('1.2.3'));

        expect(semver).toBeDefined();

        expect(semver.major).toBe(1);
        expect(semver.minor).toBe(2);
        expect(semver.patch).toBe(3);
      });
    });

    describe('with invalid input', () => {
      it('should throw with invalid string', () => {
        expect(() => new SemVer('abc')).toThrow();
      });

      it('should throw with invalid options', () => {
        expect(
          () =>
            new SemVer({
              major: 1.1,
              minor: 2,
              patch: 3,
              prerelease: undefined,
              build: undefined,
            }),
        ).toThrow();
      });
    });
  });

  describe('properties', () => {
    it('should support base version', () => {
      const semver = new SemVer('1.2.3');
      expect(semver.major).toBe(1);
      expect(semver.minor).toBe(2);
      expect(semver.patch).toBe(3);
    });

    it('should support prerelease', () => {
      const semver = new SemVer('1.2.3-dev.0');
      expect(semver.prerelease).toBe('dev.0');
    });

    it('should support build', () => {
      const semver = new SemVer('1.2.3+build8');
      expect(semver.build).toBe('build8');
    });

    it('should support prerelease and build', () => {
      const semver = new SemVer('1.2.3-dev.0+build8');
      expect(semver.prerelease).toBe('dev.0');
      expect(semver.build).toBe('build8');
    });
  });

  describe('methods', () => {
    describe('.toString(...)', () => {
      it('should support base version', () => {
        expect(new SemVer('1.2.3').toString()).toBe('1.2.3');
      });

      it('should support prerelease and build', () => {
        expect(new SemVer('1.2.3-dev.0+build8').toString()).toBe('1.2.3-dev.0+build8');
      });
    });

    describe('.compare(...)', () => {
      describe('default', () => {
        it('should support base version', () => {
          const semver = new SemVer('1.2.3');
          expect(semver.compare('1.2.3')).toBe(0);
          expect(semver.compare('1.2.2')).toBe(1);
          expect(semver.compare('1.2.4')).toBe(-1);
          expect(semver.compare('1.1.0')).toBe(1);
          expect(semver.compare('1.2.0')).toBe(1);
          expect(semver.compare('1.3.0')).toBe(-1);
          expect(semver.compare('0.0.0')).toBe(1);
          expect(semver.compare('1.0.0')).toBe(1);
          expect(semver.compare('2.0.0')).toBe(-1);
        });

        it('should support prerelease', () => {
          const semver = new SemVer('1.2.3-dev.1');
          expect(semver.compare('1.2.3')).toBe(-1);
          expect(semver.compare('1.2.3-dev.1')).toBe(0);
          expect(semver.compare('1.2.3-dev.0')).toBe(1);
          expect(semver.compare('1.2.3-dev.2')).toBe(-1);

          expect(new SemVer('1.2.3').compare('1.2.3-dev.1')).toBe(1);
        });
      });

      describe('main', () => {
        it('should support base version', () => {
          const semver = new SemVer('1.2.3');
          expect(semver.compare('1.2.3', 'main')).toBe(0);
          expect(semver.compare('1.2.2', 'main')).toBe(1);
          expect(semver.compare('1.2.4', 'main')).toBe(-1);
        });

        it('should ignore prerelease', () => {
          const semver = new SemVer('1.2.3-dev.1');
          expect(semver.compare('1.2.3', 'main')).toBe(0);
          expect(semver.compare('1.2.3-dev.1', 'main')).toBe(0);
          expect(semver.compare('1.2.3-dev.0', 'main')).toBe(0);
          expect(semver.compare('1.2.3-dev.2', 'main')).toBe(0);

          expect(new SemVer('1.2.3').compare('1.2.3-dev.1', 'main')).toBe(0);
        });
      });

      describe('prerelease', () => {
        it('should ignore if prerelease is undefined', () => {
          const semver = new SemVer('1.2.3');
          expect(semver.compare('1.2.3', 'prerelease')).toBe(0);
          expect(semver.compare('1.2.2', 'prerelease')).toBe(0);
          expect(semver.compare('1.2.4', 'prerelease')).toBe(0);
        });

        it('should support prerelease', () => {
          const semver = new SemVer('1.2.3-dev.1');
          expect(semver.compare('1.2.3', 'prerelease')).toBe(-1);
          expect(semver.compare('1.2.3-dev.1', 'prerelease')).toBe(0);
          expect(semver.compare('1.2.3-dev.0', 'prerelease')).toBe(1);
          expect(semver.compare('1.2.3-dev.2', 'prerelease')).toBe(-1);

          expect(semver.compare('1.8.3-dev.1', 'prerelease')).toBe(0);
          expect(semver.compare('1.8.3-dev.0', 'prerelease')).toBe(1);
          expect(semver.compare('1.8.3-dev.2', 'prerelease')).toBe(-1);

          expect(new SemVer('1.2.3').compare('1.2.3-dev.1', 'prerelease')).toBe(1);
        });
      });

      describe('build', () => {
        it('should ignore if build is undefined', () => {
          const semver = new SemVer('1.2.3');
          expect(semver.compare('1.2.3', 'build')).toBe(0);
          expect(semver.compare('1.2.2', 'build')).toBe(0);
          expect(semver.compare('1.2.4', 'build')).toBe(0);
        });

        it('should support build', () => {
          const semver = new SemVer('1.2.3+build.1');
          expect(semver.compare('1.2.3', 'build')).toBe(1);
          expect(semver.compare('1.2.3+build.1', 'build')).toBe(0);
          expect(semver.compare('1.2.3+build.0', 'build')).toBe(1);
          expect(semver.compare('1.2.3+build.2', 'build')).toBe(-1);

          expect(semver.compare('1.8.3+build.1', 'build')).toBe(0);
          expect(semver.compare('1.8.3+build.0', 'build')).toBe(1);
          expect(semver.compare('1.8.3+build.2', 'build')).toBe(-1);

          expect(new SemVer('1.2.3').compare('1.2.3+build.1', 'build')).toBe(-1);
        });
      });
    });

    describe('.increment(...)', () => {
      it('should support base version', () => {
        const semver = new SemVer('1.2.3');
        expect(semver.increment('major').toString()).toBe('2.0.0');
        expect(semver.increment('premajor').toString()).toBe('2.0.0-0');
        expect(semver.increment('minor').toString()).toBe('1.3.0');
        expect(semver.increment('preminor').toString()).toBe('1.3.0-0');
        expect(semver.increment('patch').toString()).toBe('1.2.4');
        expect(semver.increment('prepatch').toString()).toBe('1.2.4-0');
        expect(semver.increment('prerelease').toString()).toBe('1.2.4-0');
      });

      it('should support prerelease', () => {
        const semver = new SemVer('1.2.3-dev.19');
        expect(semver.increment('major').toString()).toBe('2.0.0');
        expect(semver.increment('premajor').toString()).toBe('2.0.0-0');
        expect(semver.increment('minor').toString()).toBe('1.3.0');
        expect(semver.increment('preminor').toString()).toBe('1.3.0-0');
        expect(semver.increment('patch').toString()).toBe('1.2.4');
        expect(semver.increment('prepatch').toString()).toBe('1.2.4-0');
        expect(semver.increment('prerelease').toString()).toBe('1.2.3-dev.20');
      });
    });
  });
});
