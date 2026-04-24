# Release 0.2.0 — prioritized checklist

Use this as the **GitHub Project** / **milestone** scope for `@dmystical-coder/fundstacks-headless-sdk@0.2.0`.  
Copy sections into individual issues (see [github-milestone-0.2.md](./github-milestone-0.2.md)) or track as one umbrella issue with sub-tasks.

**Milestone name:** `v0.2.0`  
**Target version:** `0.2.0` (SemVer **minor**: new features, backward compatible)

---

## P0 — ship blockers for a credible 0.2

- [ ] **Validation + errors** — Validate `amount > 0`, `campaignId >= 1`; wrap `BigInt()` failures in a dedicated `FundstacksError` with `code` (`INVALID_AMOUNT`, `INVALID_CAMPAIGN_ID`, `INVALID_UINT_STRING`, etc.).
- [ ] **Tests** — Cover sBTC (`sbtcAsset`, FT post-condition), invalid inputs, and `donate()` when the wallet returns `txid` / `txId` / `undefined` / `{}`.
- [ ] **README** — Fix Quick Start (`walletClient` must be defined or point to an adapter doc); document units (µSTX, sats); document `donate()` when no tx id is returned.
- [ ] **CI** — GitHub Actions: `npm ci`, `npm run lint`, `npm test`, `npm run build` on PR and `main`.

---

## P1 — high value, same minor if time allows

- [ ] **`donate()` contract** — Prefer documented behavior + optional `strictTxId` (throw if no tx id after resolve) vs silent `undefined`.
- [ ] **sBTC defaults** — Optional `sbtcAsset` on `createClient` or network-based default (mainnet/testnet) with per-call override on `BuildDonateTxInput`.
- [ ] **Public exports** — Export `FundstacksClient` (and any new error types) from `src/index.ts`.
- [ ] **Package** — `sideEffects: false`; include `CHANGELOG.md` in npm `files` if you want it published.

---

## P2 — follow-ups (0.2.x or 0.3.0)

- [ ] **Stacks interop** — Document mapping from `buildDonateTx` output to `@stacks/transactions` / Connect, or add an optional helper / peer dependency story.
- [ ] **Read helpers** — `get-campaign`-style helpers via Hiro API (align with [README roadmap](../README.md)).
- [ ] **More tx builders** — `create-campaign`, `cancel`, `withdraw`, `refund` (split per feature for issues).

---

## Pre-release

- [ ] Update [CHANGELOG.md](../CHANGELOG.md): move items from **\[0.2.0] — planned** into a dated **\[0.2.0] — YYYY-MM-DD** section; clear **\[Unreleased]**.
- [ ] Tag `v0.2.0`, create GitHub Release with notes from CHANGELOG.
- [ ] `npm publish` (after `prepublishOnly` build).

---

## Done

_(Check off here as you complete; mirror in GitHub issues if used.)_
