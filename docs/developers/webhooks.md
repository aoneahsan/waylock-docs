---
id: webhooks
title: Waylock webhooks
description: Every event Waylock can send with a sample payload, how to check the Standard Webhooks signature in Node and Python, the retry schedule, and how to pause or remove an address.
sidebar_label: Webhooks
sidebar_position: 5
slug: /developers/webhooks
---

import {GuideByline} from '@site/src/components/ReleaseFacts';

# Webhooks

<GuideByline path="/guide/developers/webhooks" />

**Waylock sends a signed message to your address when something happens, like a stop marked delivered.** Your system checks the signature, then fetches what it needs with an [access key](./access-keys.md). You add addresses on [Other apps](https://waylock.aoneahsan.com/account/apps), under **Webhooks**.

## Adding an address

1. Choose **Add an address**.
2. Enter a full `https://` address on port 443 or 8443, with no username or password in it, such as `https://hooks.your-depot.co.uk/waylock`.
3. Add a note if you like, and under **Send when**, choose at least one event.
4. Leave **Include what was written** off unless your system needs the few values it adds (see [below](#include-what-was-written)).
5. Copy the signing secret. It starts with `whsec_`, and like a key it shows again only within ten minutes of signing in.

Waylock only sends to public addresses. An address inside a private network, on Waylock's own domains or on Supabase is refused.

## What a message looks like

Each message is a `POST` with a JSON body:

```http
POST /waylock HTTP/1.1
Host: hooks.your-depot.co.uk
Content-Type: application/json
User-Agent: Waylock-Webhooks/1.0
webhook-id: msg_5f0c9e2a7d4b4c1e9a3f6b8d2e1c0a97
webhook-timestamp: 1795262340
webhook-signature: v1,8tC2E4IKZaHvrmiNT9dVPWEs66ahjoxXaNmcQiUv9nk=

{"type":"stop.delivered","timestamp":"2026-11-21T11:59:00.412Z","data":{"id":"0b9d4f6e-3c2a-4e71-8f5d-9a1b2c3d4e5f","kind":"stop","occurred_at":"2026-11-21T11:59:00.412Z"}}
```

`data` carries the record's `id`, its `kind` and `occurred_at`. Nothing else, unless you tick **Include what was written**. Coordinates never travel in a message, with or without that box.

`webhook-id` stays the same on every retry and when you choose **Send again**, so your system can ignore a copy it already has.

## Events

| Event | Sent when | `data.kind` | `data.id` is |
|---|---|---|---|
| `place.saved` | A place is saved | `place` | the place |
| `place.updated` | A saved place changes | `place` | the place |
| `place.removed` | A saved place is deleted | `place` | the place |
| `route.planned` | A route plan is made | `route` | the plan |
| `route.started` | A plan is started (`status` becomes `active`) | `route` | the plan |
| `route.updated` | Anything else on a plan changes, including archiving it | `route` | the plan |
| `route.finished` | A plan is finished (`status` becomes `completed`) | `route` | the plan |
| `route.deleted` | A plan is deleted | `route` | the plan |
| `stop.delivered` | A pending stop is marked delivered | `stop` | the stop |
| `stop.failed` | A pending stop is marked failed | `stop` | the stop |
| `stop.skipped` | A pending stop is skipped | `stop` | the stop |
| `household.member_joined` | Someone joins your household, or you join one | `household` | the household |
| `household.member_left` | Someone leaves your household, or you leave one | `household` | the household |
| `plan.changed` | Your plan changes | `plan` | the plan record |
| `webhook.test` | You choose **Send a test** | | |

Events fire for changes made anywhere: in the app, on the website, by a key or by an assistant. A household event goes to the household's owner and to the person it is about, and never says who joined or left.

A thin message, as every event sends by default:

```json
{"type":"route.started","timestamp":"2026-11-21T06:52:17.204Z","data":{"id":"6a1f0d3e-2b4c-4e8a-9f7d-c5b3a1e09d24","kind":"route","occurred_at":"2026-11-21T06:52:17.204Z"}}
```

```json
{"type":"household.member_joined","timestamp":"2026-11-21T18:03:41.930Z","data":{"id":"e71a4c9b-0d2f-4b86-a3e5-9c1d7f2b6a04","kind":"household","occurred_at":"2026-11-21T18:03:41.930Z"}}
```

```json
{"type":"plan.changed","timestamp":"2026-11-21T09:15:02.118Z","data":{"id":"3b8e1f5a-6c2d-4a97-b0e4-d5f9a2c7e183","kind":"plan","occurred_at":"2026-11-21T09:15:02.118Z"}}
```

The test message:

```json
{"type":"webhook.test","timestamp":"2026-11-21T10:30:00.000Z","data":{"message":"Test event"}}
```

### Include what was written

With the box ticked for an address, its messages add a few values:

| Part | Added |
|---|---|
| Places | `label` |
| Route plans | `route_kind` (`simple`, `delivery` or `trip`) and `status` |
| Stops | `plan_id`, `seq` and `status` |
| Households, plan | Nothing |

```json
{"type":"stop.failed","timestamp":"2026-11-21T12:41:09.655Z","data":{"id":"c3e8b1a0-7d2f-4a59-8b6e-0f1d9c2a4e37","kind":"stop","occurred_at":"2026-11-21T12:41:09.655Z","plan_id":"6a1f0d3e-2b4c-4e8a-9f7d-c5b3a1e09d24","seq":4,"status":"failed"}}
```

```json
{"type":"place.saved","timestamp":"2026-11-21T08:02:33.071Z","data":{"id":"9e2b6d41-0c7a-4f38-b5e1-3a8d2f6c9b70","kind":"place","occurred_at":"2026-11-21T08:02:33.071Z","label":"Depot gate B"}}
```

Never coordinates, Google place IDs, start or end points, a stop's held positions, parcel notes or photos, an email, or another person's name. For anything more, fetch the record with a key.

## Checking the signature

Waylock signs every message the [Standard Webhooks](https://www.standardwebhooks.com/) way. The signed text is `webhook-id`, a dot, `webhook-timestamp`, a dot, and the raw body, exactly as received. The signature is HMAC-SHA256 of that text, keyed with the base64-decoded part of your secret after `whsec_`, then base64-encoded and prefixed `v1,`. `webhook-signature` can hold more than one, separated by spaces, while a secret is being replaced; accept the message if any one matches.

Check the raw body, never JSON you parsed and wrote out again, and refuse a timestamp more than five minutes from now.

### Node

```js
import {createHmac, timingSafeEqual} from 'node:crypto';

/** True when a Waylock delivery is genuine and recent. `rawBody` is the exact text received. */
export function verifyWaylock(rawBody, headers, secret, now = Math.floor(Date.now() / 1000)) {
  const id = headers['webhook-id'];
  const timestamp = headers['webhook-timestamp'];
  const signatures = headers['webhook-signature'];
  if (!id || !timestamp || !signatures) return false;
  if (Math.abs(now - Number(timestamp)) > 300) return false;
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const expected = createHmac('sha256', key).update(`${id}.${timestamp}.${rawBody}`).digest();
  return signatures.split(' ').some(part => {
    const [version, value] = part.split(',');
    if (version !== 'v1' || !value) return false;
    const given = Buffer.from(value, 'base64');
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}
```

### Python

```python
import base64, hashlib, hmac, time

def verify_waylock(raw_body: bytes, headers, secret: str, now=None) -> bool:
    """True when a Waylock delivery is genuine and recent. raw_body is the exact bytes received."""
    msg_id = headers.get("webhook-id")
    timestamp = headers.get("webhook-timestamp")
    signatures = headers.get("webhook-signature")
    if not msg_id or not timestamp or not signatures:
        return False
    now = int(time.time()) if now is None else now
    if abs(now - int(timestamp)) > 300:
        return False
    key = base64.b64decode(secret.removeprefix("whsec_"))
    signed = f"{msg_id}.{timestamp}.".encode() + raw_body
    expected = base64.b64encode(hmac.new(key, signed, hashlib.sha256).digest()).decode()
    for part in signatures.split(" "):
        version, _, value = part.partition(",")
        if version == "v1" and hmac.compare_digest(value, expected):
            return True
    return False
```

### A message to test against

Both functions above return true for the [message shown earlier](#what-a-message-looks-like), with `now` set to `1795262340`, and this sample secret:

```text
whsec_d2F5bG9jay1kb2NzLXNhbXBsZS1zaWduaW5nLXNlY3JldC0zMmIh
```

It signs nothing real. Change one character of the body and both return false.

## Answering and retries

Answer with any `2xx` within 10 seconds. Anything else, or no answer, is a failed try. Waylock tries again after 5 seconds, 5 minutes, 30 minutes, 2 hours, 5 hours, 10 hours and 10 hours: eight tries in all, over a little more than 27 hours. Answer `410 Gone` and Waylock turns the address off at once.

An address that keeps failing for five days is turned off by Waylock. Its row says **Turned off by Waylock**; fix the address, then choose **Turn back on**.

The **Delivery log** on each address shows every message, the answer and the try number, with the time of the next try. **Send again** resends one with the same `webhook-id`.

## Replacing the secret

Choose **Replace secret**. For the next 24 hours each message carries two signatures, one from each secret, so your system can switch over without dropping a message. After that, only the new secret signs.

## Pausing or removing an address

- **Pause** stops it. Nothing is sent and nothing is queued while it's paused. **Turn back on** sends new events from then on.
- **Remove**, then press again, deletes the address. Nothing more is sent to it.

Free holds 3 webhook addresses at once, Pro 20 and Family 40.
