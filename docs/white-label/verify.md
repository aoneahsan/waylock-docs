---
id: verify
title: Checking a Waylock licence
description: How anyone can check a Waylock white-label licence by its key or by the domain a licensed copy runs on.
sidebar_label: Checking a licence
sidebar_position: 5
slug: /white-label/verify
---

import {GuideByline} from '@site/src/components/ReleaseFacts';

# Checking a Waylock licence

<GuideByline path="/guide/white-label/verify" />

Every licensed copy carries a licence key, which starts with `WAYLOCK-`, and serves a licence file at `/.well-known/waylock-white-label-license.json`. Verification is run by our licensing service.

## By key

Enter the key on [Verify a licence](https://waylock.aoneahsan.com/verify-license). The answer is one of: valid, paid but not yet deployed, revoked, no licence with this key, or not a Waylock key. A valid licence shows the company it is licensed to, its domains, the issue date and the date its updates run until. It never shows an email or a price.

## By domain

Choose **Domain** on the same page and enter the address without `https://`. Our licensing service fetches that domain's licence file and checks the key it names. It reports whether the domain holds a valid licence, names a different domain, has no file, or could not be reached.

## In the app

A licensed copy checks its own key once each time it starts. If the licence is revoked or does not cover the address it runs on, the app shows a notice and pauses. Nothing saved is deleted. A network failure never pauses the app; it checks again on the next start.
