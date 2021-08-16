import path from 'path';
import * as fs from 'fs';
import minimist from 'minimist';


/* ****************************************************************************************************************** *
 * Config
 * ****************************************************************************************************************** */

const headerMatchRegex = /^#+[^\S\r\n]+\[\d+\.\d+\.\d+\S*?]\(.+?\)$/gm;


/* ****************************************************************************************************************** *
 * Script
 * ****************************************************************************************************************** */

export function extractLog(changeLogPath?: string) {
  changeLogPath = !changeLogPath ? path.resolve(process.cwd(), 'CHANGELOG.md') :
                  path.isAbsolute(changeLogPath) ? changeLogPath :
                  path.resolve(process.cwd(), changeLogPath);

  if (!fs.existsSync(changeLogPath)) throw new Error(`Cannot resolve file: ${changeLogPath}`);

  const fileData = fs.readFileSync(changeLogPath, 'utf-8');

  headerMatchRegex.lastIndex = void 0 as any;

  const startMatch = headerMatchRegex.exec(fileData);
  if (!startMatch) throw new Error(`Could not find matching header in changelog!`);

  const endMatch = headerMatchRegex.exec(fileData) ?? { 0: '', index: fileData.length };

  return fileData
    .slice(startMatch.index, endMatch.index)
    .replace(/((?:\r?\n){2})(?:\r?\n)+/g, '$1')
    .trim()
}

if (require.main === module) {
  const res = extractLog(minimist(process.argv.slice(2))._[0]);
  process.stdout.write(res);
}
