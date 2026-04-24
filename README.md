# @dmystical-coder/fundstacks-headless-sdk

[![npm version](https://img.shields.io/npm/v/%40dmystical-coder%2Ffundstacks-headless-sdk)](https://www.npmjs.com/package/@dmystical-coder/fundstacks-headless-sdk)
[![npm monthly downloads](https://img.shields.io/npm/dm/%40dmystical-coder%2Ffundstacks-headless-sdk)](https://www.npmjs.com/package/@dmystical-coder/fundstacks-headless-sdk)
[![npm total downloads](https://img.shields.io/npm/dt/%40dmystical-coder%2Ffundstacks-headless-sdk)](https://www.npmjs.com/package/@dmystical-coder/fundstacks-headless-sdk)

Headless TypeScript SDK for FundStacks donation flows.

This package provides framework-agnostic primitives to build and execute Stacks contract-call donations (`donate-stx` / `donate-sbtc`) without coupling to React, wallet UI, or a specific app runtime.

## Installation

```bash
npm install @dmystical-coder/fundstacks-headless-sdk
```

## Release planning

- [CHANGELOG.md](./CHANGELOG.md) — version history.
- [docs/release-0.2-checklist.md](./docs/release-0.2-checklist.md) — prioritized **P0 / P1 / P2** tasks.
- [docs/github-milestone-0.2.md](./docs/github-milestone-0.2.md) — GitHub milestone and issue templates.

## Quick Start

`donate()` needs a **wallet client** that can submit a contract call (e.g. from [Leather](https://leather.io/) / [Stacks Connect](https://github.com/hirosystems/connect)). The snippet below uses a minimal stub so the example is copy-pasteable; replace it with your real adapter.

```ts
import { createClient, donate } from "@dmystical-coder/fundstacks-headless-sdk";

const walletClient = {
  callContract: async (options) => {
    // Delegate to your wallet / @stacks/connect openContractCall, then return the tx id.
    return { txid: "0x..." };
  }
};

const client = createClient({
  contractAddress: "ST000000000000000000002AMW42H",
  contractName: "fundraising",
  network: "testnet",
  walletClient
});

// Amounts: STX in micro-STX (µSTX); sBTC in satoshis — see Units below.
const txId = await donate(client, {
  campaignId: 42n,
  amount: 1_000_000n,
  asset: "stx",
  senderAddress: "ST2J8EVYHP2JXQ6XEAH2V7W4N19WQQ9Q0DXM1ANQG"
});
```

### Wallet adapter

Implement `WalletClient.callContract` so it forwards `options` from `buildDonateTx` / `donate` to your signing flow and resolves with the broadcast transaction id (string or `{ txid }` / `{ txId }`). The exact mapping to `@stacks/transactions` / Connect is app-specific; see [Stacks transaction building](https://github.com/hirosystems/stacks.js) for low-level assembly.

## Units

- **`asset: "stx"`** — `amount` is in **micro-STX** (µSTX, 1 STX = 1_000_000 µSTX), matching typical Stacks STX post-conditions.
- **`asset: "sbtc"`** — `amount` is in **satoshis** (sats), per the fundraising contract’s sBTC path.

## Build unsigned donation transaction

Use this when your app signs or broadcasts outside the SDK:

```ts
import { buildDonateTx } from "@dmystical-coder/fundstacks-headless-sdk";

const txOptions = buildDonateTx(client, {
  campaignId: 42,
  amount: 1_000_000n,
  asset: "stx",
  senderAddress: "ST2J8EVYHP2JXQ6XEAH2V7W4N19WQQ9Q0DXM1ANQG"
});
```

## API

- `createClient(config)`  
  Create a reusable SDK client with contract/network/signer settings. Optional: `sbtcAsset` (default SIP-010 id for sBTC donations), `strictTxId` (see below).
- `buildDonateTx(client, input)`  
  Build headless Stacks contract-call donation options.
- `donate(client, input, options?)`  
  Execute donation through `walletClient.callContract`. Returns the transaction id string, or **`undefined`** if the wallet resolves with no id (e.g. `void`, `{}`, or missing `txid` / `txId`). Set **`strictTxId: true`** on the client or on `donate(..., { strictTxId: true })` to throw `FundstacksError` with code `MISSING_TX_ID` instead.
- `defaultSbtcAssetForNetwork(network)`  
  Returns the documented default `sbtc-token` contract id for `mainnet` / `testnet`, or `undefined` for other networks.
- `DONATE_FUNCTIONS`  
  Function names used by the donation builders.
- `FundstacksError`  
  Thrown for validation and strict tx-id failures (subclass of `Error` with a `code` string).

| `code` | When |
| --- | --- |
| `INVALID_UINT_STRING` | `amount` or `campaignId` could not be parsed as a non-negative integer (e.g. invalid string, unsupported float). |
| `INVALID_AMOUNT` | Parsed `amount` is zero or negative. |
| `INVALID_CAMPAIGN_ID` | Parsed `campaignId` is less than 1. |
| `MISSING_SBTC_ASSET` | `asset === "sbtc"` but no SIP-010 asset id was resolved (set `sbtcAsset` on the client or input, or use `mainnet` / `testnet` for built-in defaults). |
| `MISSING_TX_ID` | `strictTxId` is enabled and the wallet returned no transaction id. |

### sBTC asset resolution

For sBTC donations, the FT post-condition needs a SIP-010 contract id string. Resolution order: `input.sbtcAsset` → `client.sbtcAsset` → `defaultSbtcAssetForNetwork(client.network)` for `mainnet` and `testnet` only (see [Stacks sBTC / Clarinet mapping](https://docs.stacks.co/clarinet/integrations/sbtc)). Override per call when your deployment uses a different token.

## Compatibility

- Node.js `>=18`
- Built output includes both ESM and CJS bundles, plus TypeScript declarations.

## Development

```bash
npm install
npm run lint
npm test
npm run build
```

CI runs on every push and pull request to `main` (lint, test, build) using Node.js 18.x and 20.x — see [.github/workflows/ci.yml](.github/workflows/ci.yml).

## Roadmap

- Add typed read helpers for campaign state
- Add create/withdraw/refund transaction builders
- Add typed wallet adapters for `@stacks/connect`

## License

MIT
