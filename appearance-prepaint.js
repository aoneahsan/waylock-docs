// Blocking head script: applies every appearance axis before first paint. The one sanctioned direct read of
// localStorage, because strata-storage cannot load in time; it reads strata's JSON wrapper at waylock:pref:<axis>,
// the same keys and values as the Waylock website. Infima reads data-theme, so it carries the resolved light or
// dark; the chosen preference (which may be "system") sits in data-theme-preference.
(function () {
  var axes = [
    { key: 'appearance', attr: 'theme-preference', def: 'system', values: ['system', 'light', 'dark'] },
    { key: 'palette', attr: 'palette', def: 'atlas', values: ['atlas', 'tide', 'orchid'] },
    { key: 'radius', attr: 'radius', def: 'medium', values: ['none', 'small', 'medium', 'large', 'full'] },
    { key: 'density', attr: 'density', def: 'comfortable', values: ['compact', 'comfortable', 'spacious'] },
    { key: 'type-scale', attr: 'type-scale', def: 'medium', values: ['small', 'medium', 'large'] },
    { key: 'font', attr: 'font', def: 'bricolage', values: ['bricolage', 'dm-sans'] },
    { key: 'surface-style', attr: 'surface-style', def: 'solid', values: ['solid', 'translucent'] },
    { key: 'motion', attr: 'motion', def: 'system', values: ['system', 'full', 'reduced'] },
    { key: 'sound', attr: 'sound', def: 'off', values: ['off', 'on'] }
  ];
  window.WAYLOCK_AXES = axes;
  var root = document.documentElement;
  var appearance = 'system';
  for (var i = 0; i < axes.length; i++) {
    var axis = axes[i];
    var saved = null;
    try { saved = (JSON.parse(localStorage.getItem('waylock:pref:' + axis.key) || 'null') || {}).value; } catch (e) { saved = null; }
    var value = axis.values.indexOf(saved) >= 0 ? saved : axis.def;
    root.setAttribute('data-' + axis.attr, value);
    if (axis.key === 'appearance') appearance = value;
  }
  var resolved = appearance === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : appearance;
  root.setAttribute('data-theme', resolved);
  root.setAttribute('data-appearance', resolved);
  // Docusaurus's own colour script runs next and reads this key; keep it on the same answer.
  try { localStorage.setItem('theme', resolved); } catch (e) { /* Storage blocked: the attributes above still apply. */ }
})();
