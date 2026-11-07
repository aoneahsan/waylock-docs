import {translate} from '@docusaurus/Translate';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const SEEN_KEY = 'legal-notice-seen';
const VISIBLE_MS = 10_000;
const SITE = 'https://waylock.aoneahsan.com';

function link(label: string, href: string): HTMLAnchorElement {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.textContent = label;
  return anchor;
}

function show(): void {
  const wrap = document.createElement('div');
  wrap.className = 'legal-notice-wrap';
  const bar = document.createElement('div');
  bar.className = 'legal-notice';
  bar.setAttribute('role', 'status');
  bar.setAttribute('aria-live', 'polite');
  const terms = document.createElement('p');
  terms.append(
    translate({id: 'notice.terms.before', message: 'By using Waylock, you agree to our '}),
    link(translate({id: 'notice.terms.privacy', message: 'Privacy Policy'}), `${SITE}/privacy`),
    translate({id: 'notice.terms.and', message: ' and '}),
    link(translate({id: 'notice.terms.terms', message: 'Terms of Service'}), `${SITE}/terms`),
    '.',
  );
  const usage = document.createElement('p');
  usage.textContent = translate({id: 'notice.usage', message: 'We count how Waylock is used, so we can improve it.'});
  const copy = document.createElement('div');
  copy.append(terms, usage);
  const okay = document.createElement('button');
  okay.type = 'button';
  okay.textContent = translate({id: 'notice.okay', message: 'Okay'});
  bar.append(copy, okay);
  wrap.append(bar);

  let timer = 0;
  let hovered = false;
  let focused = false;
  const onKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') close();
  };
  function close(): void {
    window.clearTimeout(timer);
    document.removeEventListener('keydown', onKey);
    wrap.remove();
  }
  const run = (): void => {
    window.clearTimeout(timer);
    if (!hovered && !focused) timer = window.setTimeout(close, VISIBLE_MS);
  };
  bar.addEventListener('mouseenter', () => { hovered = true; run(); });
  bar.addEventListener('mouseleave', () => { hovered = false; run(); });
  bar.addEventListener('focusin', () => { focused = true; run(); });
  bar.addEventListener('focusout', () => { focused = false; run(); });
  okay.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.append(wrap);
  run();
}

/** Shows the one quiet legal bar once per browser, marked seen the moment it shows. */
async function showLegalNoticeOnce(): Promise<void> {
  try {
    const {defineStorage} = await import('strata-storage');
    const storage = await defineStorage({namespace: 'waylock', keyPrefix: false, adapters: {localStorage: {}}, defaultStorages: ['localStorage']});
    if (storage.getSync(SEEN_KEY, {storage: 'localStorage'})) return;
    storage.setSync(SEEN_KEY, true, {storage: 'localStorage'});
    show();
  } catch {
    // Without storage the bar could not stay once-only, so it does not show at all.
  }
}

if (ExecutionEnvironment.canUseDOM) {
  if (document.readyState === 'complete') void showLegalNoticeOnce();
  else window.addEventListener('load', () => { void showLegalNoticeOnce(); }, {once: true});
}
