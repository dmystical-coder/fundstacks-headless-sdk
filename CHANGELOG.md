# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- [CHANGELOG.md](./CHANGELOG.md) (this file) for version history.
- [docs/release-0.2-checklist.md](./docs/release-0.2-checklist.md) — P0 / P1 / P2 scope for 0.2.0.
- [docs/github-milestone-0.2.md](./docs/github-milestone-0.2.md) — GitHub milestone setup and copy-paste issue bodies.
- [.github/workflows/ci.yml](./.github/workflows/ci.yml) — CI (lint, test, build) on `main` and PRs.

## [0.2.0] — _planned (not yet published)_

_Target: next minor release after `0.1.1`. Tracking: [docs/release-0.2-checklist.md](./docs/release-0.2-checklist.md)._

### Added

- _(draft)_ Structured errors (`FundstacksError` + `code`) for validation and wallet/tx edge cases.
- _(draft)_ Input validation: `amount > 0`, `campaignId >= 1`, clearer errors for invalid `BigInt` strings.
- _(draft)_ Optional default `sbtcAsset` / network-aware sBTC defaults on the client to reduce required call-site fields.
- _(draft)_ Export `FundstacksClient` from the public entry; `sideEffects: false` in `package.json` where applicable.
- _(draft)_ Expanded tests: sBTC path, invalid inputs, wallet return shapes (`txId` / `txid` / void).
- _(draft)_ CI (lint, test, build) on push/PR.
- _(draft)_ README fixes: define `walletClient` in Quick Start; document `donate()` when the tx id is missing; note µSTX / sats units explicitly.

### Changed

- _(draft)_ Clarify `donate()` behavior when `callContract` returns no id (document vs throw via option such as `strictTxId`).

### Removed

- _(none planned)_

---

## [0.1.1] — 2025 (see git tag)

See [GitHub releases](https://github.com/dmystical-coder/fundstacks-headless-sdk/releases) and `git tag -l` for exact dates.

### Added

- Headless `createClient`, `buildDonateTx`, `donate`, and `DONATE_FUNCTIONS` for STX / sBTC donations.

## [0.1.0]

- Initial public API.
