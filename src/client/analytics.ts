import siteConfig from '@generated/docusaurus.config';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

/**
 * Clarity and Amplitude for the guides; GA4 comes from the classic preset's gtag. The guides have no signed-in page,
 * so replay may run everywhere. Only the path travels: a query or hash can hold a search term.
 */
type Ids = {clarityId: string; amplitudeKey: string};
type Queue = {(...args: unknown[]): void; q?: IArguments[]};

const ids = (siteConfig.customFields?.analytics ?? {clarityId: '', amplitudeKey: ''}) as Ids;
const DEVICE_KEY = 'waylock-docs-analytics-device';

let device: Promise<string> | null = null;

/** One anonymous id per browser, kept through strata-storage like every other stored value. */
function deviceId(): Promise<string> {
  device ??= import('strata-storage')
    .then(({defineStorage}) => defineStorage({namespace: 'waylock', keyPrefix: false, adapters: {localStorage: {}}, defaultStorages: ['localStorage']}))
    .then(storage => {
      const saved = storage.getSync(DEVICE_KEY, {storage: 'localStorage'});
      if (typeof saved === 'string' && saved) return saved;
      const created = crypto.randomUUID();
      storage.setSync(DEVICE_KEY, created, {storage: 'localStorage'});
      return created;
    })
    .catch(() => crypto.randomUUID());
  return device;
}

function startClarity(projectId: string): void {
  const vendor = window as Window & {clarity?: Queue};
  const queue: Queue = function clarity() { (queue.q ??= []).push(arguments); }; // eslint-disable-line prefer-rest-params
  vendor.clarity = queue;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId}`;
  document.head.append(script);
}

async function sendAmplitude(path: string): Promise<void> {
  const deviceIdValue = await deviceId();
  await fetch('https://api2.amplitude.com/2/httpapi', {
    method: 'POST', keepalive: true, credentials: 'omit', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({api_key: ids.amplitudeKey, events: [{
      event_type: 'page_viewed', device_id: deviceIdValue, time: Date.now(), platform: 'Web',
      event_properties: {path, site: 'docs'},
    }]}),
  }).catch(() => undefined);
}

if (ExecutionEnvironment.canUseDOM && ids.clarityId) startClarity(ids.clarityId);

export function onRouteDidUpdate({location}: {location: Location}): void {
  if (!ExecutionEnvironment.canUseDOM) return;
  if (ids.amplitudeKey) void sendAmplitude(location.pathname);
  (window as Window & {clarity?: Queue}).clarity?.('event', 'page_viewed');
}
