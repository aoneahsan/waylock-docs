import {translate} from '@docusaurus/Translate';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

/**
 * The one Appearance control for the guides (D-102): the Waylock website's panel, axes and words, opened from the
 * header button in docusaurus.config.ts. static/appearance-prepaint.js applies the saved choices before paint.
 */
type Axis = {key: string; attr: string; def: string; values: string[]};
type Storage = {setSync: (key: string, value: unknown, options: {storage: 'localStorage'}) => void};

const words: Record<string, string> = {
  'theme.title': translate({id: 'theme.title', message: 'Appearance'}),
  'theme.intro': translate({id: 'theme.intro', message: 'Choose how these guides look on this device.'}),
  'theme.yourView': translate({id: 'theme.yourView', message: 'Your view'}),
  'theme.close': translate({id: 'theme.close', message: 'Close appearance panel'}),
  'theme.reset': translate({id: 'theme.reset', message: 'Reset appearance'}),
  'theme.axis.appearance': translate({id: 'theme.axis.appearance', message: 'Appearance'}),
  'theme.axis.palette': translate({id: 'theme.axis.palette', message: 'Colour treatment'}),
  'theme.axis.radius': translate({id: 'theme.axis.radius', message: 'Corner shape'}),
  'theme.axis.density': translate({id: 'theme.axis.density', message: 'Density'}),
  'theme.axis.type-scale': translate({id: 'theme.axis.type-scale', message: 'Text size'}),
  'theme.axis.font': translate({id: 'theme.axis.font', message: 'Typeface'}),
  'theme.axis.surface-style': translate({id: 'theme.axis.surface-style', message: 'Panel background'}),
  'theme.axis.motion': translate({id: 'theme.axis.motion', message: 'Motion'}),
  'theme.axis.sound': translate({id: 'theme.axis.sound', message: 'Sound'}),
  'theme.appearance-system': translate({id: 'theme.appearance-system', message: 'System'}),
  'theme.appearance-light': translate({id: 'theme.appearance-light', message: 'Light'}),
  'theme.appearance-dark': translate({id: 'theme.appearance-dark', message: 'Dark'}),
  'theme.palette-atlas': translate({id: 'theme.palette-atlas', message: 'Atlas · warm route'}),
  'theme.palette-tide': translate({id: 'theme.palette-tide', message: 'Tide · cool blue'}),
  'theme.palette-orchid': translate({id: 'theme.palette-orchid', message: 'Orchid · violet'}),
  'theme.radius-none': translate({id: 'theme.radius-none', message: 'Square'}),
  'theme.radius-small': translate({id: 'theme.radius-small', message: 'Small'}),
  'theme.radius-medium': translate({id: 'theme.radius-medium', message: 'Medium'}),
  'theme.radius-large': translate({id: 'theme.radius-large', message: 'Large'}),
  'theme.radius-full': translate({id: 'theme.radius-full', message: 'Round'}),
  'theme.density-compact': translate({id: 'theme.density-compact', message: 'Compact'}),
  'theme.density-comfortable': translate({id: 'theme.density-comfortable', message: 'Comfortable'}),
  'theme.density-spacious': translate({id: 'theme.density-spacious', message: 'Spacious'}),
  'theme.type-scale-small': translate({id: 'theme.type-scale-small', message: 'Small'}),
  'theme.type-scale-medium': translate({id: 'theme.type-scale-medium', message: 'Medium'}),
  'theme.type-scale-large': translate({id: 'theme.type-scale-large', message: 'Large'}),
  'theme.font-bricolage': translate({id: 'theme.font-bricolage', message: 'Bricolage'}),
  'theme.font-dm-sans': translate({id: 'theme.font-dm-sans', message: 'DM Sans'}),
  'theme.surface-style-solid': translate({id: 'theme.surface-style-solid', message: 'Solid'}),
  'theme.surface-style-translucent': translate({id: 'theme.surface-style-translucent', message: 'Translucent'}),
  'theme.motion-system': translate({id: 'theme.motion-system', message: 'System'}),
  'theme.motion-full': translate({id: 'theme.motion-full', message: 'Full'}),
  'theme.motion-reduced': translate({id: 'theme.motion-reduced', message: 'Reduced'}),
  'theme.sound-off': translate({id: 'theme.sound-off', message: 'Off'}),
  'theme.sound-on': translate({id: 'theme.sound-on', message: 'On'}),
};

let panel: HTMLElement | null = null;
let audio: AudioContext | null = null;
let storage: Promise<Storage> | null = null;

const root = (): HTMLElement => document.documentElement;
const axes = (): Axis[] => (window as Window & {WAYLOCK_AXES?: Axis[]}).WAYLOCK_AXES ?? [];
const resolve = (value: string): string =>
  value === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : value;

function make<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** Saved through strata-storage under the website's keys (waylock:pref:<axis>), which the pre-paint script reads. */
function save(key: string, value: string): void {
  storage ??= import('strata-storage').then(({defineStorage}) =>
    defineStorage({namespace: 'waylock', keyPrefix: false, adapters: {localStorage: {}}, defaultStorages: ['localStorage']}) as unknown as Storage);
  void storage.then(store => store.setSync(`pref:${key}`, value, {storage: 'localStorage'})).catch(() => undefined);
}

function showResolved(preference: string): void {
  const resolved = resolve(preference);
  root().setAttribute('data-theme', resolved);
  root().setAttribute('data-appearance', resolved);
}

function sync(): void {
  panel?.querySelectorAll<HTMLElement>('[role=radio]').forEach(card => {
    const chosen = root().getAttribute(`data-${card.dataset.axis}`) === card.dataset.value;
    card.setAttribute('aria-checked', String(chosen));
    card.tabIndex = chosen ? 0 : -1;
  });
}

function applyAxis(axis: Axis, value: string): void {
  if (!axis.values.includes(value)) return;
  root().setAttribute(`data-${axis.attr}`, value);
  if (axis.key === 'appearance') showResolved(value);
  save(axis.key, value);
  sync();
}

function close(returnFocus = true): void {
  if (!panel || panel.hidden) return;
  panel.hidden = true;
  if (returnFocus) document.querySelector<HTMLElement>('[data-action=theme]')?.focus();
}

function preview(axis: Axis, value: string, card: HTMLElement): void {
  const shape = (className: string, text?: string) => {
    const node = make('span', className, text);
    node.setAttribute('aria-hidden', 'true');
    card.append(node);
  };
  if (axis.key === 'palette') shape(`theme-swatch theme-swatch-${value}`);
  if (axis.key === 'radius') shape(`theme-radius-preview theme-radius-${value}`);
  if (axis.key === 'density') shape(`theme-density-preview theme-density-${value}`);
  if (axis.key === 'surface-style') shape(`theme-surface-preview theme-surface-${value}`);
  if (axis.key === 'type-scale' || axis.key === 'font') shape(`theme-type-preview theme-type-${value}`, 'Aa');
}

function build(): HTMLElement {
  const aside = make('aside', 'theme-panel');
  aside.id = 'waylock-theme-panel';
  aside.hidden = true;
  aside.setAttribute('role', 'dialog');
  aside.setAttribute('aria-modal', 'false');
  aside.setAttribute('aria-label', words['theme.title']);
  const head = make('div', 'theme-panel-head');
  const title = make('div');
  title.append(make('p', 'theme-kicker', words['theme.yourView']), make('h2', '', words['theme.title']));
  const closeButton = make('button', 'theme-close', '×');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', words['theme.close']);
  closeButton.addEventListener('click', () => close());
  head.append(title, closeButton);
  const options = make('div', 'theme-options');
  for (const axis of axes()) {
    const field = make('section', 'theme-axis');
    const heading = make('h3', '', words[`theme.axis.${axis.key}`]);
    heading.id = `axis-${axis.key}`;
    const cards = make('div', 'theme-cards');
    cards.setAttribute('role', 'radiogroup');
    cards.setAttribute('aria-labelledby', heading.id);
    for (const value of axis.values) {
      const card = make('button', 'theme-card');
      card.type = 'button';
      card.dataset.axis = axis.attr;
      card.dataset.value = value;
      card.setAttribute('role', 'radio');
      preview(axis, value, card);
      card.append(make('span', '', words[`theme.${axis.key}-${value}`]));
      card.addEventListener('click', () => applyAxis(axis, value));
      cards.append(card);
    }
    cards.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = axis.values.indexOf(root().getAttribute(`data-${axis.attr}`) ?? axis.def);
      const step = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? axis.values.length - 1
        : (index + step + axis.values.length) % axis.values.length;
      applyAxis(axis, axis.values[next]);
      cards.querySelector<HTMLElement>(`[data-value="${axis.values[next]}"]`)?.focus();
    });
    field.append(heading, cards);
    options.append(field);
  }
  const foot = make('div', 'theme-panel-foot');
  const reset = make('button', 'button-outline', words['theme.reset']);
  reset.type = 'button';
  reset.addEventListener('click', () => axes().forEach(axis => applyAxis(axis, axis.def)));
  foot.append(reset);
  aside.append(head, make('p', 'theme-intro', words['theme.intro']), options, foot);
  document.body.append(aside);
  return aside;
}

function click(event: MouseEvent): void {
  const target = event.target as Element | null;
  if (target?.closest?.('[data-action=theme]')) {
    panel ??= build();
    panel.hidden = !panel.hidden;
    if (!panel.hidden) {
      sync();
      panel.querySelector<HTMLElement>('.theme-close')?.focus();
    }
    return;
  }
  if (root().dataset.sound === 'on' && target?.closest?.('button')) {
    try {
      audio ??= new AudioContext();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = 470;
      gain.gain.value = 0.025;
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start();
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.045);
      oscillator.stop(audio.currentTime + 0.05);
    } catch { /* Sound stays optional when the browser withholds audio. */ }
  }
}

if (ExecutionEnvironment.canUseDOM) {
  // Delegated: the navbar re-renders on route changes, the button with it.
  document.addEventListener('click', click);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  document.addEventListener('pointerdown', event => {
    const target = event.target as Element | null;
    if (panel && !panel.hidden && !panel.contains(target) && !target?.closest?.('[data-action=theme]')) close(false);
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (root().getAttribute('data-theme-preference') === 'system') showResolved('system');
  });
}
