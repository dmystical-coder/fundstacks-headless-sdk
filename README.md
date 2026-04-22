# @dmystical-coder/fundstacks-headless-sdk

Headless TypeScript SDK for FundStacks donation flows.

This package provides framework-agnostic primitives to build and execute Stacks contract-call donations (`donate-stx` / `donate-sbtc`) without coupling to React, wallet UI, or a specific app runtime.

## Installation

```bash
npm install @dmystical-coder/fundstacks-headless-sdk
```

## Quick Start

```ts
import { createClient, donate } from "@dmystical-coder/fundstacks-headless-sdk";

const client = createClient({
  contractAddress: "ST000000000000000000002AMW42H",
  contractName: "fundraising",
  network: "testnet",
  walletClient // your Stacks wallet adapter
});

const txId = await donate(client, {
  campaignId: 42n,
  amount: 1_000_000n, // microstacks
  asset: "stx",
  senderAddress: "ST2..."
});
```

## Build Unsigned Donation Transaction

Use this when your app signs/broadcasts transactions outside the SDK:

```ts
import { buildDonateTx } from "@dmystical-coder/fundstacks-headless-sdk";

const txOptions = buildDonateTx(client, {
  campaignId: 42,
  amount: 1_000_000n, // microstacks or sats
  asset: "stx",
  senderAddress: "ST2..."
});

// txOptions = { contractAddress, contractName, functionName, functionArgs, postConditions, ... }
```

## API

- `createClient(config)`  
  Create a reusable SDK client with contract/network/signer settings.
- `buildDonateTx(client, input)`  
  Build headless Stacks contract-call donation options.
- `donate(client, input)`  
  Execute donation through a provided wallet client adapter.
- `DONATE_FUNCTIONS`  
  Function names used by the donation builders.

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

## Roadmap

- Add typed read helpers for campaign state
- Add create/withdraw/refund transaction builders
- Add typed wallet adapters for `@stacks/connect`

## License

MIT
