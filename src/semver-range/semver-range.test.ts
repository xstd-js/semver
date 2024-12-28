import { describe, expect, it } from 'vitest';
import { SemVerRange } from './semver-range.js';

describe('SemVerRange', () => {
  describe('construct', () => {
    describe('with valid input', () => {
      it('should construct with valid string', () => {
        const semver = new SemVerRange('1.2.3');

        expect(semver).toBeDefined();
      });

      it('should construct providing another SemVer', () => {
        const semver = new SemVerRange(new SemVerRange('1.2.3'));

        expect(semver).toBeDefined();
      });
    });

    describe('with invalid input', () => {
      it('should throw with invalid string', () => {
        expect(() => new SemVerRange('abc')).toThrow();
      });
    });
  });

  describe('methods', () => {
    describe('.toString(...)', () => {
      it('should support different formats', () => {
        expect(new SemVerRange('1.2.3').toString()).toBe('1.2.3');
        expect(new SemVerRange('1.2.3 - 2.3.4').toString()).toBe('1.2.3 - 2.3.4');
        expect(new SemVerRange('^1').toString()).toBe('^1');
        expect(new SemVerRange('~1').toString()).toBe('~1');
        expect(new SemVerRange('*').toString()).toBe('*');
        expect(new SemVerRange('1.x.x').toString()).toBe('1.x.x');
        expect(new SemVerRange('>1 <2').toString()).toBe('>1 <2');
        expect(new SemVerRange('1 || 2').toString()).toBe('1 || 2');
      });
    });
  });
});
