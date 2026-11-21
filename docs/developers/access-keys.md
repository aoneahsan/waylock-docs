---
id: access-keys
title: Waylock access keys
description: Make a Waylock access key for the API, choose what it can read, change or delete and how long it lasts, then show, replace or remove it later.
sidebar_label: Access keys
sidebar_position: 2
slug: /developers/access-keys
---

import {GuideByline} from '@site/src/components/ReleaseFacts';

# Access keys

<GuideByline path="/guide/developers/access-keys" />

**An access key lets a spreadsheet, script or dispatch tool use the [Waylock API](./api.md) as you, with only what you tick.** Keys look like `wl_pat_…`. You make them on **Other apps**, under **Access keys**: on the [website](https://waylock.aoneahsan.com/account/apps) or in the Android app's **Settings**.

Give each tool its own key, so removing one stops only that tool.

## Making a key

1. Choose **Make a key**.
2. Under **What it's for**, give it a name only you see, like "Depot spreadsheet".
3. Under **What it can do**, tick **Read**, **Change** or **Delete** for each part: Saved places, Route plans, Stops and Trip stop requests. Family and Plan and usage have **Read** only. Tick at least one Read box.
4. Under **How long it lasts**, choose 30 days, 90 days, a year, or **Never ends**.
5. Make the key and copy it. We email you that a key was made, never the key itself.

Delete stays off unless you tick it, and Change and Delete reach only your own records.

**Only a read-only key can be kept without an end date.** A key with any Change or Delete tick must end after 30 days, 90 days or a year; the server refuses one set to never end.

## What each tick reaches

| Tick | In the API | Addresses |
|---|---|---|
| Saved places | `places:read`, `places:write`, `places:delete` | `/places` |
| Route plans | `routes:read`, `routes:write`, `routes:delete` | `/routes` |
| Stops | `stops:read`, `stops:write`, `stops:delete` | `/stops` |
| Trip stop requests | `trip_requests:read`, `trip_requests:write`, `trip_requests:delete` | `/trip_requests` |
| Family | `family:read` | `/households`, `/household_memberships` |
| Plan and usage | `usage:read` | `/plan`, `/usage` |

**Change** is the `:write` scope: it creates and changes. A request outside a key's ticks answers `403` with the scope it needed in `details.scope`.

## Showing a key again

Waylock shows a new key once. After that, **Show again** works within ten minutes of signing in. If you signed in longer ago, the row asks you to **Sign in again**, then brings you back to the same row. With [two-step sign-in](./two-step-sign-in.md) on, showing a key also needs a fresh code, even on a remembered browser or phone.

Admin never shows your key. Support sees its name, its first characters, its ticks and its dates, and a webhook address by its host only.

## Replacing a key

Choose **Replace**, then **Make the new key**. Waylock makes a new key with the same name and reach, and the old one keeps working for 24 hours, then stops; its row says when. If the old key had an end date, the new one ends 90 days after the replacement. A key that never ends is replaced by another that never ends.

## Removing a key

Choose **Remove**, then press again. The key stops at once, and the next request with it answers `401`.

## Checking what a key can do

`GET /token` needs no tick. It answers with the kind of credential, your account id and the scopes it holds:

```bash
curl https://tmaycqghtpbonstmonjd.supabase.co/functions/v1/api/v1/token \
  -H "Authorization: Bearer $WAYLOCK_KEY"
```

```json
{
  "data": {
    "kind": "pat",
    "user_id": "4c1e8a2f-6b3d-4f90-a7e5-2d9c0b1a8e63",
    "client_id": null,
    "scopes": ["account:read", "routes:read", "stops:read", "stops:write"]
  }
}
```

Each row on Other apps also shows when the key was made, when it was last used and when it ends.

## How many you can have

Free holds 5 keys at once, Pro 25 and Family 50. When every one is in use, remove a key or [see plans](https://waylock.aoneahsan.com/plans). Every limit is in the [overview](./index.md#limits-on-each-plan).

Keep a key out of shared code and public repositories. Anyone holding it can do what it's ticked for until you remove it.
