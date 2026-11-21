---
id: api
title: The Waylock API
description: The Waylock REST API — base URL, the Authorization header, the response envelope, errors, cursor pages, rate limits, and every resource with a curl example.
sidebar_label: The API
sidebar_position: 3
slug: /developers/api
---

import {GuideByline} from '@site/src/components/ReleaseFacts';

# The Waylock API

<GuideByline path="/guide/developers/api" />

**The Waylock API is a JSON REST API over your own places, route plans, stops and trip stop requests.** Every request carries an [access key](./access-keys.md) and goes to one base URL:

```text
https://tmaycqghtpbonstmonjd.supabase.co/functions/v1/api/v1
```

The [OpenAPI document](https://tmaycqghtpbonstmonjd.supabase.co/functions/v1/api/v1/openapi.json) describes every address and field, and is built from the same field list the API serves. It needs no key, and there is a [Markdown copy](https://tmaycqghtpbonstmonjd.supabase.co/functions/v1/api/v1/openapi.md) too. The examples below set two shell variables first:

```bash
export WAYLOCK_API="https://tmaycqghtpbonstmonjd.supabase.co/functions/v1/api/v1"
export WAYLOCK_KEY="wl_pat_…"   # from Other apps → Access keys
```

## Signing requests

Send the key as a bearer token:

```bash
curl "$WAYLOCK_API/routes" -H "Authorization: Bearer $WAYLOCK_KEY"
```

A request acts as you. It sees the rows you see in Waylock, in the parts the key is ticked for, and nothing of anyone else's. The API also accepts the sign-in token of an assistant you connected, though assistants usually come in through [MCP](./assistants.md).

Bodies are JSON with `Content-Type: application/json`, up to 64 KB. A field the resource doesn't list is refused, never ignored.

## What comes back

One record comes back inside `data`:

```json
{ "data": { "id": "9e2b6d41-0c7a-4f38-b5e1-3a8d2f6c9b70", "label": "Depot gate B", "source": "manual" } }
```

A list comes back as a page, with `meta`:

```json
{ "data": [ { "id": "…" }, { "id": "…" } ], "meta": { "next_cursor": "eyJyIjoi…", "limit": 20 } }
```

A create answers `201` with the new record. A delete answers `204` with no body, or `202` when an assistant asked for it (see [Deleting](#deleting)).

## Errors

Every error has the same shape. `message` is a sentence you can show a person; quote `correlation_id` when you write to us.

```json
{
  "error": {
    "code": "scope_required",
    "message": "This credential needs the stops:write permission.",
    "details": { "scope": "stops:write" },
    "correlation_id": "req_3f9a1c07d2e84b65"
  }
}
```

| Status | `code` | When |
|---|---|---|
| 400 | `invalid_request` | A field is missing, not allowed or the wrong shape (`details.issues` lists each one), the body isn't JSON, a linked record isn't yours, or a cursor has run out |
| 401 | `invalid_token` | No key, or a key that is wrong, ended or removed |
| 403 | `scope_required` | The key isn't ticked for this. `details.scope` names the tick it needs |
| 404 | `not_found` | Nothing with that id on your account, including another person's id and a malformed one |
| 405 | `method_not_allowed` | The address exists, but not for this method, such as a `POST` to `/households` |
| 409 | `conflict` | A trip rule refused the change, such as a new stop on a finished plan. `message` says which |
| 413 | `payload_too_large` | The body is over 64 KB |
| 429 | `rate_limited` | Too many requests. Wait for `Retry-After` seconds |
| 500 | `internal` | Something went wrong on our side |

## Pages of results

Lists return 20 records unless you ask for between 1 and 50 with `limit`. When there are more, `meta.next_cursor` holds a cursor; send it back as `cursor` with the same query. When it's `null`, you have them all.

```bash
curl "$WAYLOCK_API/stops?plan_id.eq=6a1f0d3e-2b4c-4e8a-9f7d-c5b3a1e09d24&sort=seq&limit=50" \
  -H "Authorization: Bearer $WAYLOCK_KEY"
curl "$WAYLOCK_API/stops?plan_id.eq=6a1f0d3e-2b4c-4e8a-9f7d-c5b3a1e09d24&sort=seq&limit=50&cursor=eyJyIjoi…" \
  -H "Authorization: Bearer $WAYLOCK_KEY"
```

A cursor lasts 15 minutes and works only for the query that made it. After that, start again without it. Each list names its orders under `sort` and its filters as `field.eq=value`, below.

## Rate limits

- **120 requests a minute** for each key or assistant.
- **Requests a day** for you, across every key and assistant together: 5,000 on Free, 50,000 on Pro, 100,000 on Family. The day starts again at midnight UTC.

Answers carry `RateLimit-Limit`, `RateLimit-Remaining` and `RateLimit-Reset` (seconds until the tighter of the two limits starts again). A `429` adds `Retry-After`. Refused requests still count, so a tight retry loop keeps you refused.

## Deleting

With a key ticked **Delete**, a `DELETE` removes the record at once and answers `204`.

When an assistant asks to delete something, nothing goes straight away. The API answers `202`:

```json
{
  "data": {
    "status": "pending_confirmation",
    "confirm_url": "https://waylock.aoneahsan.com/developers/confirm/2d7c9e14-5a3b-4f86-8e0d-b1c4a7f3e952",
    "expires_at": "2026-11-21T10:22:00.000Z"
  }
}
```

The person opens the link, sees what it asked to delete, and chooses **Delete it** or **Keep it**. After 10 minutes the request ends and nothing is deleted. More in [Assistants](./assistants.md#deletes-wait-for-your-yes).

## Locations

`origin`, `destination`, a stop's `place_snapshot` and a trip request's `chosen_place` are locations in the app's own form: a Google place, or a pin of yours.

```json
{ "kind": "google_place", "placeId": "ChIJdd4hrwug2EcRmSrV3Vo6llI", "userLabel": "Depot" }
{ "kind": "manual", "lat": 51.5072, "lng": -0.1276, "userLabel": "Back gate" }
```

`userLabel` is optional. Locations come back through the API because they are your own records; they never travel in a [webhook](./webhooks.md).

## Saved places

The labels and pins you saved, newest first. `kind` is always `custom`, a place you saved yourself. `source` is `manual` for a pin (send `latitude` and `longitude`) or `google_place` (send `place_id`).

| | |
|---|---|
| Addresses | `GET /places` · `POST /places` · `GET`, `PATCH`, `DELETE /places/{id}` |
| Sort | `-created_at` (default), `created_at` |
| Fields | `id`, `kind`, `label`, `source`, `place_id`, `latitude`, `longitude`, `created_at`, `updated_at` |
| You send | `label` (up to 120 characters) and `source`, both required; `place_id`, `latitude`, `longitude` |

```bash
curl -X POST "$WAYLOCK_API/places" \
  -H "Authorization: Bearer $WAYLOCK_KEY" -H "Content-Type: application/json" \
  -d '{"label": "Depot gate B", "source": "manual", "latitude": 53.4794, "longitude": -2.2453}'
```

## Route plans

Delivery runs, trips and simple routes, newest first. `kind` is `simple`, `delivery` or `trip`, and a plan keeps its kind. `status` moves one way: `draft` → `active` (started) → `completed` (finished), and any of them → `archived`. A new plan starts as `draft` or `active`. Start and end points change only while the plan is a draft. `settings` holds the plan's settings as the app saved them; read a plan you made in the app before you write one. `optimisation_version` counts how many times the order was optimised.

| | |
|---|---|
| Addresses | `GET /routes` · `POST /routes` · `GET`, `PATCH`, `DELETE /routes/{id}` |
| Filter | `status.eq` |
| Sort | `-created_at` (default), `created_at` |
| Fields | `id`, `kind`, `status`, `origin`, `destination`, `settings`, `optimisation_version`, `created_at`, `updated_at` |
| You send | `kind` and `origin`, both required; `status`, `destination` (leave it out when the run ends at its last stop), `settings` |

```bash
curl "$WAYLOCK_API/routes?status.eq=active" -H "Authorization: Bearer $WAYLOCK_KEY"
```

```json
{
  "data": [
    {
      "id": "6a1f0d3e-2b4c-4e8a-9f7d-c5b3a1e09d24",
      "kind": "delivery",
      "status": "active",
      "origin": { "kind": "manual", "lat": 53.4794, "lng": -2.2453, "userLabel": "Depot" },
      "destination": null,
      "optimisation_version": 2,
      "created_at": "2026-11-21T06:40:12.000Z",
      "updated_at": "2026-11-21T07:05:48.000Z"
    }
  ],
  "meta": { "next_cursor": null, "limit": 20 }
}
```

`settings` is left out above. Each plan carries it, in the app's own shape.

Finish a run:

```bash
curl -X PATCH "$WAYLOCK_API/routes/6a1f0d3e-2b4c-4e8a-9f7d-c5b3a1e09d24" \
  -H "Authorization: Bearer $WAYLOCK_KEY" -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

## Stops

Stops on your plans. `seq` is a stop's number on its plan, from 0, set by Waylock. A new stop goes at the end of a draft or started plan, as `pending`; a plan holds at most 100. `constraints` holds held positions and time windows as the app saved them. An outcome is set once, from `pending` to `delivered`, `failed` or `skipped`, and `completed_at` records when. A stop with an outcome is final: it can't change, move or be deleted. A stop stays on its plan; to move one, delete it and add it to the other plan. Deleting a pending stop closes the gap in the numbers.

| | |
|---|---|
| Addresses | `GET /stops` · `POST /stops` · `GET`, `PATCH`, `DELETE /stops/{id}` |
| Filter | `plan_id.eq` |
| Sort | `seq`, `-seq`, `created_at`, `-created_at` |
| Fields | `id`, `plan_id`, `seq`, `place_snapshot`, `constraints`, `status`, `completed_at`, `created_at`, `updated_at` |
| You send | `plan_id` and `place_snapshot`, both required; `constraints`; `status` to set the outcome |

Add a drop to the end of a run:

```bash
curl -X POST "$WAYLOCK_API/stops" \
  -H "Authorization: Bearer $WAYLOCK_KEY" -H "Content-Type: application/json" \
  -d '{"plan_id": "6a1f0d3e-2b4c-4e8a-9f7d-c5b3a1e09d24", "place_snapshot": {"kind": "manual", "lat": 53.4668, "lng": -2.3197, "userLabel": "Unit 4, Trafford Park"}}'
```

Mark it delivered:

```bash
curl -X PATCH "$WAYLOCK_API/stops/c3e8b1a0-7d2f-4a59-8b6e-0f1d9c2a4e37" \
  -H "Authorization: Bearer $WAYLOCK_KEY" -H "Content-Type: application/json" \
  -d '{"status": "delivered"}'
```

## Trip stop requests

Stops you asked for along a trip, such as fuel between 50 and 60 km out, oldest first. `anchor` says where the range is measured from: `origin`, the start of the trip, or `previous_stop`. `chosen_place` is the place picked for the request, once one is.

| | |
|---|---|
| Addresses | `GET /trip_requests` · `POST /trip_requests` · `GET`, `PATCH`, `DELETE /trip_requests/{id}` |
| Filter | `plan_id.eq` |
| Sort | `created_at` (default), `-created_at` |
| Fields | `id`, `plan_id`, `seq`, `query`, `range_start_meters`, `range_end_meters`, `anchor`, `chosen_place`, `created_at`, `updated_at` |
| You send | `plan_id`, `seq` (0 to 99), `query` (up to 120 characters), `range_start_meters`, `range_end_meters` and `anchor`, all required; `chosen_place` |

```bash
curl -X POST "$WAYLOCK_API/trip_requests" \
  -H "Authorization: Bearer $WAYLOCK_KEY" -H "Content-Type: application/json" \
  -d '{"plan_id": "b85d2c6f-1e4a-4b37-9c08-7f3e2a1d6b59", "seq": 0, "query": "fuel", "range_start_meters": 50000, "range_end_meters": 60000, "anchor": "origin"}'
```

## Family, read only

A household involves other people, so it's read only from outside Waylock, whatever the key says: a `POST`, `PATCH` or `DELETE` answers `405`. Both need the **Family** tick (`family:read`).

| Address | What it holds |
|---|---|
| `GET /households`, `GET /households/{id}` | Your household's `name`, its `seat_limit`, and your `role` in it: `owner` or `member`. Never who else is in it |
| `GET /household_memberships`, `GET /household_memberships/{id}` | Your own place in a household: `household_id`, `role`, `accepted_at` |

```bash
curl "$WAYLOCK_API/households" -H "Authorization: Bearer $WAYLOCK_KEY"
```

## Plan and usage, read only

Both need the **Plan and usage** tick (`usage:read`), and both answer `405` to anything but `GET`.

| Address | What it holds |
|---|---|
| `GET /plan`, `GET /plan/{id}` | Your plan: `plan_code` (`free`, `pro`, `family` or another code), `plan_name`, `source` (`play`, `polar`, `admin` or `referral`), your `ai_level` (`spark`, `pulse` or `surge`), `starts_at`, `ends_at` |
| `GET /usage`, `GET /usage/{id}` | Your counts: the UTC day or month in `period`, what was counted in `kind` (such as `route_requests` or `ai_calls`), and `count` so far |
| `GET /token` | What the key in this request is and which scopes it holds. Needs no tick ([example](./access-keys.md#checking-what-a-key-can-do)) |

```bash
curl "$WAYLOCK_API/usage" -H "Authorization: Bearer $WAYLOCK_KEY"
```

Payments, purchase tokens and Polar's subscription details are never here.
