import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

const roots = ['docs', 'src/pages', 'static'];
const badNames = /(^|\/)(?:\.env(?:\.|$)|.*\.(?:jks|keystore|pem|p8)$|.*(?:secret|credential|serviceaccount).*)/i;
const badText = /NEEDS DECISION|review candidate|TODO: publish|AIza[0-9A-Za-z_-]{20,}/i;
let failures = 0;
function inspect(directory) {
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {inspect(path); continue;}
    if (badNames.test(path)) {process.stderr.write(`Disallowed file: ${path}\n`); failures++; continue;}
    if (/\.(?:md|mdx|tsx|ts|txt|xml|html|svg)$/.test(path) && badText.test(readFileSync(path, 'utf8'))) {
      process.stderr.write(`Review marker or credential-like text: ${path}\n`); failures++;
    }
  }
}
for (const root of roots) inspect(root);
if (failures) process.exit(1);
process.stdout.write('Content and file-name check passed.\n');
