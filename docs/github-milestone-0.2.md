# GitHub: milestone + issues for v0.2.0

Repository: [dmystical-coder/fundstacks-headless-sdk](https://github.com/dmystical-coder/fundstacks-headless-sdk)

## Automation (GitHub CLI)

With [`gh`](https://cli.github.com/) installed and authenticated (`gh auth login`):

1. **Create the milestone** (skip if it already exists — you may get a validation error):

   ```bash
   gh api repos/dmystical-coder/fundstacks-headless-sdk/milestones -X POST \
     -f title='v0.2.0' \
     -f description='Headless SDK: validation, errors, tests, docs, CI. See docs/release-0.2-checklist.md on main.'
   ```

2. **Create all issues** (idempotent: skips an issue if an open issue with the same title is already in milestone `v0.2.0`):

   ```bash
   cd /path/to/fundstacks-headless-sdk
   ./scripts/gh-create-issues-0.2.sh
   ```

   Optional args: `./scripts/gh-create-issues-0.2.sh OWNER/REPO milestone-title`

3. **List what was created:**

   ```bash
   gh issue list -R dmystical-coder/fundstacks-headless-sdk -m v0.2.0
   ```

---

## 1. Create the milestone (manual)

1. On GitHub: **Issues → Milestones → New milestone**
2. **Title:** `v0.2.0`
3. **Description:** _Headless SDK: validation, errors, tests, docs, CI (see `docs/release-0.2-checklist.md`)._
4. **Due date:** optional (set when you target npm publish)

---

## 2. Umbrella issue (optional)

Create one issue titled:

**`meta: track v0.2.0 release`**

Body (copy-paste):

```markdown
Tracking release **0.2.0** for `@dmystical-coder/fundstacks-headless-sdk`.

**Checklist:** [docs/release-0.2-checklist.md](https://github.com/dmystical-coder/fundstacks-headless-sdk/blob/main/docs/release-0.2-checklist.md)

**Changelog draft:** [CHANGELOG.md](https://github.com/dmystical-coder/fundstacks-headless-sdk/blob/main/CHANGELOG.md)

Close this when `v0.2.0` is tagged and published to npm.
```

Assign milestone: **v0.2.0**

---

## 3. Suggested child issues (copy title + body)

Create one issue per block; assign milestone **v0.2.0** and label e.g. `enhancement`, `documentation`, `testing`, `ci` as fits.

### Issue A — Validation and FundstacksError

**Title:** `feat: add input validation and FundstacksError codes`

**Body:**

```markdown
## Scope
- Validate `amount > 0`, `campaignId >= 1` in `buildDonateTx` / `donate` path.
- Replace opaque `BigInt` throws with `FundstacksError` including `code`: e.g. `INVALID_AMOUNT`, `INVALID_CAMPAIGN_ID`, `INVALID_UINT_STRING`.

## Acceptance
- Unit tests for invalid strings, zero/negative amounts, invalid campaign id.
- Document error codes in README (short table).

Part of [release 0.2 checklist](docs/release-0.2-checklist.md).
```

---

### Issue B — Tests (sBTC + wallet shapes)

**Title:** `test: expand coverage for sBTC and wallet return values`

**Body:**

```markdown
## Scope
- sBTC: assert post-conditions and requirement for `sbtcAsset` when `asset === "sbtc"`.
- `donate()`: mock wallet returning `{ txid }`, `{ txId }`, `undefined`, and empty object; lock expected behavior with tests.

## Acceptance
- `npm test` green; coverage acceptable for `src/core/donate.ts`.

Part of [release 0.2 checklist](docs/release-0.2-checklist.md).
```

---

### Issue C — README and Quick Start

**Title:** `docs: fix Quick Start and document units and donate() return`

**Body:**

```markdown
## Scope
- Quick Start: either show a minimal fake `walletClient` or link to "Wallet adapter" section.
- State clearly: STX amounts in **micro-STX**, sBTC in **sats** (per contract).
- Document when `donate()` resolves to `undefined` and recommended handling.

## Acceptance
- Examples run as copy-paste with only placeholder addresses/network.

Part of [release 0.2 checklist](docs/release-0.2-checklist.md).
```

---

### Issue D — CI workflow

**Title:** `ci: add GitHub Actions for lint, test, and build`

**Body:**

```markdown
## Scope
- Workflow on `pull_request` and `push` to `main`: Node 18.x (or 20.x), `npm ci`, `npm run lint`, `npm test`, `npm run build`.
- Fail PR if any step fails.

## Acceptance
- Green run on `main`; documented in README under Development if needed.

Part of [release 0.2 checklist](docs/release-0.2-checklist.md).
```

---

### Issue E — donate() strict tx id (optional behavior)

**Title:** `feat: optional strictTxId when wallet does not return a transaction id`

**Body:**

```markdown
## Scope
- Add optional flag (e.g. on `donate` or client config) so missing tx id throws a `FundstacksError` with code `MISSING_TX_ID` instead of returning `undefined`.
- Default remains backward compatible unless you choose to bump major for stricter defaults (prefer **minor** with opt-in).

## Acceptance
- Tests; README note.

Part of [release 0.2 checklist](docs/release-0.2-checklist.md).
```

---

### Issue F — sBTC client defaults

**Title:** `feat: optional network-aware sbtcAsset default on client`

**Body:**

```markdown
## Scope
- Allow `createClient({ ..., sbtcAsset?: string })` or network-based default for mainnet/testnet, overridable per `buildDonateTx` / `donate` input.

## Acceptance
- Tests; README; no breaking change for callers who already pass `sbtcAsset` on each donation.

Part of [release 0.2 checklist](docs/release-0.2-checklist.md).
```

---

### Issue G — Exports and package.json

**Title:** `chore: export FundstacksClient and enable tree-shaking metadata`

**Body:**

```markdown
## Scope
- Export `FundstacksClient` and new error types from `src/index.ts`.
- Set `sideEffects: false` in package.json if accurate; add `CHANGELOG.md` to `files` if publishing changelog.

## Acceptance
- `npm run build` and types resolve for consumers.

Part of [release 0.2 checklist](docs/release-0.2-checklist.md).
```

---

## 4. After release

- Close all milestone issues; close **meta: track v0.2.0**.
- Publish GitHub Release from tag `v0.2.0` with notes from [CHANGELOG.md](../CHANGELOG.md).
