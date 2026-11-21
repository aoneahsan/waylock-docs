---
id: index
title: Waylock for developers
description: What a script, an assistant such as Claude or ChatGPT, or your own server can reach in your Waylock account, the three addresses they use, and what each plan allows.
sidebar_label: Overview
sidebar_position: 1
slug: /developers
---

import {GuideByline} from '@site/src/components/ReleaseFacts';

# Waylock for developers

<GuideByline path="/guide/developers" />

**Your saved places, route plans, stops and trip stop requests can be read and changed from outside Waylock, by tools you connect yourself.** A depot spreadsheet with an access key, an assistant such as Claude planning with your routes, or your dispatch system hearing the moment a stop is marked delivered. You set each one up on **Other apps**: on the website under [Account → Other apps](https://waylock.aoneahsan.com/account/apps), or in the Android app under **Settings → Other apps**. Both show the same list, so removing something in one place removes it in both.

Each key, assistant or webhook acts as you and reaches only your own records, and only the parts you tick for it.

## Three ways in

| Way | What it's for | Read |
|---|---|---|
| An access key and the API | A spreadsheet, script or dispatch tool lists your route plans, adds stops to a draft run or reads today's counts | [Access keys](./access-keys.md), [The API](./api.md) |
| An assistant | Ask Claude, ChatGPT, Claude Code or Cursor to "add these six drops to Tuesday's run" or "which stops failed today?" | [Assistants](./assistants.md) |
| Webhooks | Waylock sends a signed message to your server when something happens, like a route started or a stop skipped | [Webhooks](./webhooks.md) |

There is no calendar feed. Waylock route plans carry no date, so there is nothing to put in a calendar.

## What an outside app can reach

| Part | What it holds | From outside |
|---|---|---|
| Saved places | The labels and pins you saved | Read, change, delete |
| Route plans | Delivery runs, trips and simple routes, with their settings | Read, change, delete |
| Stops | Stops on your plans, held positions, time windows and outcomes | Read, change, delete |
| Trip stop requests | Stops you asked for along a trip, like fuel 50–60 km out | Read, change, delete |
| Family | Your household, its seats, and your own place in it | Read only |
| Plan and usage | Your plan, your AI level and today's counts | Read only |

Delete is its own tick, off unless you choose it. When an assistant deletes something, it only prepares the delete; you confirm it in Waylock within 10 minutes, or nothing goes.

Family and Plan and usage are read only whatever a key says: a `POST`, `PATCH` or `DELETE` there answers `405`. Nothing from outside can invite someone, remove a member, change seats or touch a payment. A household read never names its other members.

## What an outside app can never reach

- Your Google sign-in, two-step codes and recovery codes.
- Your keys, webhook secrets, and your own AI key.
- Payments, cards or anything about a purchase.
- Other people's plans, even people in your Family.
- A GPS trail. Waylock doesn't keep one: where you've been exists only as your own plans and stop outcomes.
- Parcel details on a stop. Waylock's server keeps none.
- Admin, or another person's account.

No address in the API reaches these, whatever a key is ticked for.

## The addresses

| | Address |
|---|---|
| API base | `https://tmaycqghtpbonstmonjd.supabase.co/functions/v1/api/v1` |
| OpenAPI document | [`…/api/v1/openapi.json`](https://tmaycqghtpbonstmonjd.supabase.co/functions/v1/api/v1/openapi.json), also as [Markdown](https://tmaycqghtpbonstmonjd.supabase.co/functions/v1/api/v1/openapi.md). No key needed |
| MCP, for assistants | `https://tmaycqghtpbonstmonjd.supabase.co/functions/v1/mcp` |
| Confirming an assistant's delete | `https://waylock.aoneahsan.com/developers/confirm/<id>` |

The addresses sit on Waylock's own Supabase project, which is why they don't carry the `waylock.aoneahsan.com` name.

## Limits on each plan

| | Free | Pro | Family |
|---|---|---|---|
| Access keys at once | 5 | 25 | 50 |
| API and assistant requests a day | 5,000 | 50,000 | 100,000 |
| Webhook addresses at once | 3 | 20 | 40 |
| Connected assistants at once | 3 | 10 | 25 |

Requests a day count every key and assistant of yours together, and the day starts again at midnight UTC. Each key or assistant is also held to 120 requests a minute, so a runaway script stops early. Other apps shows where you stand under **Against your plan**. For more room, see [plans](https://waylock.aoneahsan.com/plans).

## Two-step sign-in

Keys, signing secrets and connected assistants are worth protecting. [Two-step sign-in](./two-step-sign-in.md) adds a six-digit code from your phone after Google, and showing a saved key again always asks for a fresh one.

## Where things stand

The API, the MCP address, webhooks and two-step sign-in have been live since 21 November 2026. The Android app itself is in internal testing (see [release status](../release-status.md)), so most people reach Other apps on the website. Changes to this section are listed in the [changelog](./changelog.md).
