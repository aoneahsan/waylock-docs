---
id: route-controls
title: How are Waylock routes meant to work?
description: Planned stop locks, distance ranges and wrong-turn choices, with the current release limits.
sidebar_label: Route controls
sidebar_position: 2
tags: [routes, stops, navigation]
slug: /route-controls
---

import {GuideByline} from '@site/src/components/ReleaseFacts';

# How are Waylock routes meant to work?

<GuideByline path="/guide/route-controls" />

Waylock is intended to let you hold a delivery stop in place, choose a range for a trip stop and decide what to do after a wrong turn. Device proof is still missing. Before treating these as available steps, [check the release status](./release-status.md).

## How would I keep a delivery stop in position?

A stop lock is intended to keep one chosen delivery stop in place while the planner reorders other stops around it, subject to the limits you set. Review the estimated order while stopped, before you set off. Times are estimates.

## How would I choose a stop within a distance range?

The Trip planner is intended to find a matching stop within a range measured along the route from the origin or a previous stop. Check the proposed place and route before guidance. A search can find no match.

## What would happen after a wrong turn?

Your chosen route is designed to stay visible as an overlay while the Google Navigation SDK may reroute its own guidance, so you can compare a way back with a new route. Stop before choosing. The exact recovery steps for a failed route calculation still need a device test.

## What steps and recovery can this guide give?

None yet. The device test must show the actual stop-lock, Trip planner and route-choice controls before the guide can name steps a driver can follow. It must also show what remains safe after a failed route calculation and how the driver recovers. Until then, [check the release status](./release-status.md).
