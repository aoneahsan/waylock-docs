---
id: two-step-sign-in
title: Two-step sign-in for Waylock
description: Turn on two-step sign-in on the Waylock website or Android app, keep your ten recovery codes, remember a browser or phone for seven days, and what to do if you lose your phone.
sidebar_label: Two-step sign-in
sidebar_position: 6
slug: /developers/two-step-sign-in
---

import {GuideByline} from '@site/src/components/ReleaseFacts';

# Two-step sign-in

<GuideByline path="/guide/developers/two-step-sign-in" />

**After Google, Waylock asks for a six-digit code from an app on your phone, so someone with your Google password still can't open your routes.** It's optional for everyone and free on every plan. It lives on the website under [Account → Two-step sign-in](https://waylock.aoneahsan.com/account/security), and in the Android app under **Settings → Two-step sign-in**. Turning it on in one turns it on for both.

## Setting it up

Any authenticator app works: Google Authenticator, Microsoft Authenticator, 1Password, Aegis.

1. Choose **Set up two-step**.
2. Add Waylock to your authenticator: scan the square, or type the key if you can't scan. On the phone that runs Waylock, **Open in an authenticator app** hands the key over directly.
3. Type the code it shows, then choose **Turn on two-step**.
4. Keep your ten recovery codes. Copy all ten or download them as a text file, then choose **I've kept them**.

Each recovery code works once, if your phone is lost or wiped. This is the only time Waylock shows them, so keep them somewhere that isn't your phone.

## Signing in

Sign in with Google as before. Waylock then asks for the code from your authenticator app. Codes change every 30 seconds; type the one showing now. After too many wrong codes, Waylock asks you to wait and says until when.

## Remembering a browser or phone for seven days

Under the code box, **Remember this browser for seven days** on the website, or **Remember this phone for seven days** in the app, is unticked. Tick it and that browser or phone skips the code for seven days, then asks again. Visiting doesn't stretch the seven days. Leave it unticked on a shared or borrowed computer or phone.

A remembered browser or phone never skips:

- Google itself.
- Showing a saved key or webhook signing secret again. That always asks for a fresh code.
- Allowing an [assistant](./assistants.md) to change or delete anything.
- Admin, for Waylock staff.

On the website, the browser is remembered by a cookie only Waylock's server can read. On Android, the phone keeps it in its keystore. Both are listed on Two-step sign-in under **Remembered browsers** and **Remembered devices**, where **Forget** or **Forget all** makes them ask for a code next time. Signing out forgets that browser or phone too.

**Recent sign-ins** lists where your account is signed in, and **Sign out everywhere else** signs out every other browser and device. The one you're using stays signed in.

## Recovery codes

A recovery code is ten characters with a dash, like `abcde-23456`. On the code screen, choose **Use a recovery code instead** and type one. It signs you in once and is then used up. We email you when one is used, and Two-step sign-in shows how many of the ten are left.

Two-step stays on after a recovery code. To make a new set, choose **Make new recovery codes**; it needs a sign-in from the last ten minutes and a code, and the old set stops working the moment the new one is made.

## If you lose your phone

1. Sign in with Google, then use a recovery code.
2. On Two-step sign-in, choose **Moved to a new phone** within ten minutes.
3. Add Waylock to the authenticator on the new phone and type the code it shows.

The old phone's authenticator stops working for Waylock. If the old phone still works, you can type a code from it instead of a recovery code.

## If you lose your phone and your recovery codes

Write to support at [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com).

**What support can do:** once support has checked it is you, a Waylock admin turns two-step off for your account. You then sign in with Google alone until you set it up again, and we email you that it happened. Every reset is audited with its reason.

**What support can't do:** see or send your recovery codes, read your keys or signing secrets, set two-step up for you, or switch it off for someone without checking who they are.

## Turning it off

Choose **Turn off two-step** and type a code. Your remembered browsers and devices are forgotten too.

Staff accounts keep two-step on; if a staff member's phone is gone, a more senior admin resets it from Admin. Admin asks for a fresh code at every staff sign-in, even on a remembered browser.
