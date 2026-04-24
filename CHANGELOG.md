# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_(Nothing yet.)_

## [0.2.0] — 2026-04-24

### Added

- `FundstacksError` with `code` for validation and optional strict transaction id handling (`INVALID_AMOUNT`, `INVALID_CAMPAIGN_ID`, `INVALID_UINT_STRING`, `MISSING_SBTC_ASSET`, `MISSING_TX_ID`).
- Input validation: `amount > 0`, `campaignId >= 1`; invalid `BigInt` input strings map to `INVALID_UINT_STRING`.
- `createClient` options: `sbtcAsset`, `strictTxId`; `donate(..., { strictTxId })` overrides client default.
- Default sBTC SIP-010 contract id for `mainnet` / `testnet` via `defaultSbtcAssetForNetwork()` and automatic resolution when building sBTC donations.
- Expanded tests: sBTC post-conditions, client/network defaults, wallet return shapes (`txid` / `txId` / void / `{}`), `strictTxId`.
- Public type export: `FundstacksClient`; `sideEffects: false` in `package.json`.
- CI (lint, test, build) on `main` and PRs for Node.js 18.x and 20.x ([.github/workflows/ci.yml](.github/workflows/ci.yml)).

### Changed

- README: copy-paste Quick Start with stub `walletClient`; units (µSTX / sats); `donate()` when the result has no tx id; sBTC asset resolution; error code table.

## [0.1.1] — 2025 (see git tag)

See [GitHub releases](https://github.com/dmystical-coder/fundstacks-headless-sdk/releases) and `git tag -l` for exact dates.

### Added

- Headless `createClient`, `buildDonateTx`, `donate`, and `DONATE_FUNCTIONS` for STX / sBTC donations.

## [0.1.0]

- Initial public API.
