import { extractLog } from '../src';
import path from 'path';


/* ****************************************************************************************************************** *
 * Tests
 * ****************************************************************************************************************** */

describe(`Specific Tess`, () => {
  test(`Supports headings without link`, () => {
    expect(extractLog(path.resolve(__dirname, 'assets/FIRST.md')).replace(/\r?\n/g, '\n')).toBe(
      `## 1.0.0 (2021-08-16)\n\n` +
      `### Features\n\n` +
      `* First version complete ([03026b4](https://github.com/nonara/extract-changelog-release/commit/03026b432806f306259b186a7493a5e57c895198))`
    );
  });
});
