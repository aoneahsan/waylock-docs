import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

const roots = ['docs', 'src/pages', 'src/content', 'src/components', 'src/theme', 'static'];
const badNames = /(^|\/)(?:\.env(?:\.|$)|.*\.(?:jks|keystore|pem|p8)$|.*(?:secret|credential|serviceaccount).*)/i;
const badText = /NEEDS DECISION|HELD UNTIL|SELF-CHECK|Mount check|Editorial status|Publication check|\bD-\d{3}\b|review candidate|TODO: publish|AIza[0-9A-Za-z_-]{20,}/i;

/** Returns one line per shipped file with a forbidden name, an editorial marker or credential-like text. */
export function findContentFailures(siteDir: string): string[] {
  const failures: string[] = [];
  const inspect = (directory: string): void => {
    for (const entry of readdirSync(join(siteDir, directory), {withFileTypes: true})) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {inspect(path); continue;}
      if (badNames.test(path)) {failures.push(`Disallowed file: ${path}`); continue;}
      if (/\.(?:md|mdx|tsx|ts|json|txt|xml|html|svg)$/.test(path) && badText.test(readFileSync(join(siteDir, path), 'utf8'))) {
        failures.push(`Review marker or credential-like text: ${path}`);
      }
    }
  };
  for (const root of roots) inspect(root);
  return failures;
}
