---
id: changelog
title: Waylock developer changelog
description: Dated changes to Waylock's API, MCP address, webhooks and two-step sign-in, newest first.
sidebar_label: Changelog
sidebar_position: 7
slug: /developers/changelog
---

import {GuideByline} from '@site/src/components/ReleaseFacts';

# Developer changelog

<GuideByline path="/guide/developers/changelog" />

Changes to what outside apps can reach in Waylock, newest first. The [OpenAPI document](https://tmaycqghtpbonstmonjd.supabase.co/functions/v1/api/v1/openapi.json) always describes the API as it runs now.

## 21 November 2026

The first version, `v1`, went live.

- **API** at `https://tmaycqghtpbonstmonjd.supabase.co/functions/v1/api/v1`: saved places, route plans, stops and trip stop requests to read, change and delete; Family and Plan and usage to read. [The API](./api.md)
- **Access keys** (`wl_pat_…`) with Read, Change and Delete ticks per part. A key that can change things always has an end date. [Access keys](./access-keys.md)
- **MCP** at `https://tmaycqghtpbonstmonjd.supabase.co/functions/v1/mcp` for Claude, ChatGPT, Claude Code and Cursor. An assistant's delete waits for your yes for 10 minutes. [Assistants](./assistants.md)
- **Webhooks** for 14 events plus `webhook.test`, signed the Standard Webhooks way. [Webhooks](./webhooks.md)
- **Two-step sign-in** on the website and the Android app, with ten recovery codes and an opt-in seven-day remembered browser or phone. [Two-step sign-in](./two-step-sign-in.md)
- No calendar feed: route plans carry no date.
