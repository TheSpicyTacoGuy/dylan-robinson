# Security

This repository builds a static site. It has no server, no database and no
accounts, so the attack surface is the built output and the host configuration,
not application code.

## Reporting

Please do not open a public issue for a security problem. Use the repository's
private reporting channel instead:

<https://github.com/TheSpicyTacoGuy/dylan-robinson/security/advisories/new>

Expect a reply within a few days. There is no bounty.

## What is defended, and where

- `vite.config.ts` injects a `Content-Security-Policy` meta tag at build time,
  hashing the one inline theme script. It allows no third-party origins.
- `vercel.json` sends `Strict-Transport-Security`, `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `frame-ancestors` and a
  `Permissions-Policy` that denies camera, microphone and geolocation.
- Fonts, images and scripts are all self hosted. The site makes no request to
  another origin, so there is nothing third party to compromise.
- There are no secrets in this repository. It reads no environment variables,
  because it has nothing to authenticate to.

If you are adding a feature that needs an external service, that assumption
changes and this file needs updating with it.
