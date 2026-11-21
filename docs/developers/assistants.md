---
id: assistants
title: Connect Claude, ChatGPT, Claude Code or Cursor to Waylock
description: Add Waylock's MCP address to an assistant, approve what it can do on a Waylock page, confirm the deletes it asks for, and disconnect it from Other apps.
sidebar_label: Assistants
sidebar_position: 4
slug: /developers/assistants
---

import {GuideByline} from '@site/src/components/ReleaseFacts';

# Assistants

<GuideByline path="/guide/developers/assistants" />

**Claude, ChatGPT and coding tools can plan with your routes through Waylock's MCP address.** You approve each one on a Waylock page and choose what it can do. It never needs an access key.

```text
https://tmaycqghtpbonstmonjd.supabase.co/functions/v1/mcp
```

The same address, with a copy button, is under **Assistants** on [Other apps](https://waylock.aoneahsan.com/account/apps).

## Connecting one

| Assistant | Steps |
|---|---|
| Claude | Settings → Connectors → **Add custom connector**. Paste the address and name it Waylock. Claude opens a Waylock page: choose what it can do and press **Allow**. |
| ChatGPT | Settings → Connectors → **Create** (turn on developer mode if it asks). Paste the address, choose OAuth, and save. ChatGPT opens a Waylock page: choose what it can do and press **Allow**. |
| Claude Code | Run the command below in a terminal, then type `/mcp` in Claude Code and choose `waylock`. Your browser opens a Waylock page: choose what it can do and press **Allow**. |
| Cursor | Settings → MCP → **Add new MCP server**. Choose Streamable HTTP and paste the address. Cursor opens a Waylock page: choose what it can do and press **Allow**. |

```bash
claude mcp add --transport http waylock https://tmaycqghtpbonstmonjd.supabase.co/functions/v1/mcp
```

## The page that asks you

The Waylock page names the assistant and the address it returns to, and says which account it would act as. You tick **Read**, **Change** or **Delete** for Saved places, Route plans, Stops and Trip stop requests, and **Read** for Family and Plan and usage. Tick at least one Read box, or choose **Don't allow**.

- Delete is off unless you tick it. Even then, each delete waits for your yes in Waylock.
- With [two-step sign-in](./two-step-sign-in.md) on, a remembered browser can allow read-only access without a code. Ticking any Change or Delete box asks for one.
- If every assistant your plan allows is already connected, the page says so. Remove one on Other apps first.

An assistant can never read your Google sign-in, two-step codes, keys, payments, your own AI key, or anyone else's plans.

## What an assistant can do

Its tools follow your ticks, one set per part:

| Tool | What it does |
|---|---|
| `list_places`, `list_routes`, `list_stops`, `list_trip_requests` | Up to 50 records a call, with a cursor for the next page. Stops and trip requests filter by `plan_id.eq`, route plans by `status.eq` |
| `get_…` | One record by its id |
| `create_…`, `update_…` | Make or change a record, held to the same trip rules as [the API](./api.md#route-plans) |
| `prepare_delete_…` | Asks you to delete a record. Nothing goes until you confirm |
| `list_households`, `list_household_memberships`, `list_plan`, `list_usage` and their `get_…` | Read only. There are no tools that change them |

So "add these six drops to the end of Tuesday's run", "mark stop 4 as failed" or "how many route requests have I made today?" all work, within what you ticked. Every call counts toward your plan's requests a day, together with your keys.

## Deletes wait for your yes

When an assistant deletes a place, a route plan, a stop or a trip stop request, it only prepares the delete. It gets back a link of the form `https://waylock.aoneahsan.com/developers/confirm/<id>` and passes it to you.

1. Open the link while signed in to Waylock.
2. Check **What it asked to delete**.
3. Choose **Delete it**, or **Keep it**.

The request ends 10 minutes after it was made. If you do nothing, nothing is deleted; ask again from the assistant if you still want it gone. Requests still waiting are listed under **Waiting for your yes** on Other apps, so you can open one later in those 10 minutes.

## Renaming or disconnecting

Every assistant you allowed is under **Connected** on Other apps, with when it was connected and last used.

- **Rename** gives it a name of 1 to 60 characters on that list.
- **Remove**, then press again, disconnects it. It can't reach your account any more, even mid-conversation.

Removing it on the website removes it in the Android app too, and the other way round.
