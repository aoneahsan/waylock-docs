import type {LoadContext, Plugin} from '@docusaurus/types';
import {findContentFailures} from './content-lint';
import {checkPublication} from './publish-check';
import {printLedger, verifyAndWriteSiteOutput} from './site-output';

/** The site's own build steps: page-ledger checks and generated files after a build, plus the lint and deploy-gate commands. */
export default function waylockBuildPlugin({siteDir, outDir}: LoadContext): Plugin {
  return {
    name: 'waylock-build',
    postBuild() {
      verifyAndWriteSiteOutput({siteDir, outDir});
    },
    extendCli(cli) {
      cli.command('waylock:lint').description('Refuse editorial markers, forbidden files and credential-like text in shipped sources.').action(() => {
        const failures = findContentFailures(siteDir);
        if (failures.length) {
          process.stderr.write(`${failures.join('\n')}\n`);
          process.exit(1);
        }
        process.stdout.write('Content and file-name check passed.\n');
      });
      cli.command('waylock:publish-check').description('Refuse a deploy until the recorded publication inputs and live pages are real.').action(async () => {
        await checkPublication({siteDir, outDir});
        process.stdout.write('Publication check passed.\n');
      });
      cli.command('waylock:ledger').description('Print the page ledger the current build/ needs.').action(() => {
        printLedger({siteDir, outDir});
      });
    },
  };
}
