import { extractLog } from '../src'
import path from 'path';
import process from 'process';
import * as child_process from 'child_process';


/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const assetsPath = path.resolve(__dirname, 'assets');
const logPath = path.resolve(assetsPath, 'CHANGELOG.md');
const srcIndexPath = path.resolve(__dirname, '../src/index.ts');

const expected =
  `## [3.3.0](https://github.com/LeDDGroup/typescript-transform-paths/compare/v3.2.1...v3.3.0) (2021-08-10)\n\n` +
  `### Features\n\n` +
  `* Added typescript-transform-paths/register script `+
  `([8c36b09](https://github.com/LeDDGroup/typescript-transform-paths/commit/8c36b098a837d1ed04c04a8fb8a39a03eb0bbadf))`;

const modes = [ 'Programmatic', 'CLI' ] as const;


/* ****************************************************************************************************************** *
 * Helpers
 * ****************************************************************************************************************** */

function extract(mode: typeof modes[number], logPath?: string) {
  if (mode === 'Programmatic') return extractLog(logPath);

  const cwd = process.cwd();
  const cmd = `ts-node -T ${srcIndexPath}${logPath ? ` ${logPath}` : '' }`;
  return child_process
    .execSync(cmd, { cwd, stdio: 'pipe' })
    .toString();
}


/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe.each(modes)(`[%s]`, (mode) => {
  describe(`Extracts path`, () => {
    let cwdSpy: jest.SpyInstance;
    test(`Explicit path`, () => {
      cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(__dirname);
      expect(extract(mode, logPath)).toBe(expected);
      cwdSpy.mockRestore();
    });

    test(`Explicit path (relative)`, () => {
      cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(assetsPath);
      expect(extract(mode, 'CHANGELOG2.md')).toBe(expected);
      cwdSpy.mockRestore();
    });

    test(`Implicit path (CWD)`, () => {
      cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(assetsPath);
      expect(extract(mode)).toBe(expected);
      cwdSpy.mockRestore();
    });
  });

  describe(`Throws if path not found`, () => {
    let cwdSpy: jest.SpyInstance;
    beforeAll(() => {
      cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(__dirname);
    });
    afterAll(() => {
      cwdSpy.mockRestore();
    });

    test(`Explicit path`, () => {
      expect(() => extract(mode, logPath + '.2')).toThrow(`Cannot resolve file`);
    });

    test(`Implicit path (CWD)`, () => {
      expect(() => extract(mode)).toThrow(`Cannot resolve file`);
    });
  });
});
