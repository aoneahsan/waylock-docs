---
id: route-controls
title: How are Waylock routes meant to work?
description: The planned stop lock, distance range and locked route controls, with their current verification limits.
sidebar_label: Route controls
sidebar_position: 2
tags: [routes, stops, navigation]
slug: /route-controls
---

# How are Waylock routes meant to work?

Waylock is in development. These controls describe the planned Android experience. Device and released-app checks remain open, so these are not steps for an available Play release.

## What does holding a delivery stop do?

A stop lock is intended to keep a chosen delivery stop in a planned position while other stops can be reordered around it. Review the estimated order and its constraints while stopped, before setting off.

## Where can a distance-range stop go?

The Trip planner is intended to find a matching stop within the distance range you choose along the route. The range is measured from the origin or a previous stop. Confirm the proposed place and route before using guidance.

## What happens after a wrong turn?

Waylock is designed to keep your chosen route visible as an overlay. Google Navigation SDK may still reroute its guidance. The planned choices are to review a way back to the chosen route or adopt a new route. Make that choice while stopped.

For the release position, see [Is Waylock available yet?](./release-status.md).
