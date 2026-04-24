#!/usr/bin/env bash
# Idempotent: skips creating an issue if one with the same title already exists (open) for milestone v0.2.0
set -euo pipefail
REPO="${1:-dmystical-coder/fundstacks-headless-sdk}"
MILESTONE="${2:-v0.2.0}"
B="$(mktemp -d)"
trap 'rm -rf "$B"' EXIT

exists_title() {
  local title="$1"
  gh issue list -R "$REPO" -s open -m "$MILESTONE" -L 200 --json title -q '.[].title' | grep -xF "$title" >/dev/null
}

create() {
  local title="$1" bodyfile="$2"
  if exists_title "$title"; then
    echo "Skip (exists): $title"
    return 0
  fi
  gh issue create -R "$REPO" -m "$MILESTONE" -t "$title" -F "$bodyfile"
  echo "Created: $title"
}

cat > "$B/00-meta.md" <<'MD'
Tracking release **0.2.0** for `@dmystical-coder/fundstacks-headless-sdk`.

**Checklist:** [docs/release-0.2-checklist.md](https://github.com/dmystical-coder/fundstacks-headless-sdk/blob/main/docs/release-0.2-checklist.md)

**Changelog draft:** [CHANGELOG.md](https://github.com/dmystical-coder/fundstacks-headless-sdk/blob/main/CHANGELOG.md)

Close this when `v0.2.0` is tagged and published to npm.
MD

cat > "$B/01-feat-validation.md" <<'MD'
## Scope
- Validate `amount > 0`, `campaignId >= 1` in `buildDonateTx` / `donate` path.
- Replace opaque `BigInt` throws with `FundstacksError` including `code`: e.g. `INVALID_AMOUNT`, `INVALID_CAMPAIGN_ID`, `INVALID_UINT_STRING`.

## Acceptance
- Unit tests for invalid strings, zero/negative amounts, invalid campaign id.
- Document error codes in README (short table).

Part of [release 0.2 checklist](https://github.com/dmystical-coder/fundstacks-headless-sdk/blob/main/docs/release-0.2-checklist.md).
MD

cat > "$B/02-test-sbtc.md" <<'MD'
## Scope
- sBTC: assert post-conditions and requirement for `sbtcAsset` when `asset === "sbtc"`.
- `donate()`: mock wallet returning `{ txid }`, `{ txId }`, `undefined`, and empty object; lock expected behavior with tests.

## Acceptance
- `npm test` green; coverage acceptable for `src/core/donate.ts`.

Part of [release 0.2 checklist](https://github.com/dmystical-coder/fundstacks-headless-sdk/blob/main/docs/release-0.2-checklist.md).
MD

cat > "$B/03-docs-readme.md" <<'MD'
## Scope
- Quick Start: either show a minimal fake `walletClient` or link to "Wallet adapter" section.
- State clearly: STX amounts in **micro-STX**, sBTC in **sats** (per contract).
- Document when `donate()` resolves to `undefined` and recommended handling.

## Acceptance
- Examples run as copy-paste with only placeholder addresses/network.

Part of [release 0.2 checklist](https://github.com/dmystical-coder/fundstacks-headless-sdk/blob/main/docs/release-0.2-checklist.md).
MD

cat > "$B/04-ci.md" <<'MD'
## Scope
- Workflow on `pull_request` and `push` to `main`: Node 18.x (or 20.x), `npm ci`, `npm run lint`, `npm test`, `npm run build`.
- Fail PR if any step fails.

## Acceptance
- Green run on `main`; documented in README under Development if needed.

Part of [release 0.2 checklist](https://github.com/dmystical-coder/fundstacks-headless-sdk/blob/main/docs/release-0.2-checklist.md).
MD

cat > "$B/05-strict-txid.md" <<'MD'
## Scope
- Add optional flag (e.g. on `donate` or client config) so missing tx id throws a `FundstacksError` with code `MISSING_TX_ID` instead of returning `undefined`.
- Default remains backward compatible unless you choose to bump major for stricter defaults (prefer **minor** with opt-in).

## Acceptance
- Tests; README note.

Part of [release 0.2 checklist](https://github.com/dmystical-coder/fundstacks-headless-sdk/blob/main/docs/release-0.2-checklist.md).
MD

cat > "$B/06-sbtc-default.md" <<'MD'
## Scope
- Allow `createClient({ ..., sbtcAsset?: string })` or network-based default for mainnet/testnet, overridable per `buildDonateTx` / `donate` input.

## Acceptance
- Tests; README; no breaking change for callers who already pass `sbtcAsset` on each donation.

Part of [release 0.2 checklist](https://github.com/dmystical-coder/fundstacks-headless-sdk/blob/main/docs/release-0.2-checklist.md).
MD

cat > "$B/07-exports.md" <<'MD'
## Scope
- Export `FundstacksClient` and new error types from `src/index.ts`.
- Set `sideEffects: false` in package.json if accurate; add `CHANGELOG.md` to `files` if publishing changelog.

## Acceptance
- `npm run build` and types resolve for consumers.

Part of [release 0.2 checklist](https://github.com/dmystical-coder/fundstacks-headless-sdk/blob/main/docs/release-0.2-checklist.md).
MD

create "meta: track v0.2.0 release" "$B/00-meta.md"
create "feat: add input validation and FundstacksError codes" "$B/01-feat-validation.md"
create "test: expand coverage for sBTC and wallet return values" "$B/02-test-sbtc.md"
create "docs: fix Quick Start and document units and donate() return" "$B/03-docs-readme.md"
create "ci: add GitHub Actions for lint, test, and build" "$B/04-ci.md"
create "feat: optional strictTxId when wallet does not return a transaction id" "$B/05-strict-txid.md"
create "feat: optional network-aware sbtcAsset default on client" "$B/06-sbtc-default.md"
create "chore: export FundstacksClient and enable tree-shaking metadata" "$B/07-exports.md"

echo "Done. List with: gh issue list -R $REPO -m $MILESTONE"
