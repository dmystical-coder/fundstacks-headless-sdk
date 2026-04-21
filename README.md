# fundstacks-headless-sdk

Headless TypeScript SDK for FundStacks donation flows.

This package provides framework-agnostic primitives to build and execute donation transactions (`hype`) against the NexusEngine contract without coupling to React, wallet UI, or a specific app runtime.

## Installation

```bash
npm install fundstacks-headless-sdk viem
```

## Quick Start

```ts
import { createClient, donate } from "fundstacks-headless-sdk";

const client = createClient({
  contractAddress: "0xYourNexusEngineAddress",
  chainId: 10143,
  account: "0xYourWalletAddress",
  walletClient // viem wallet client
});

const txHash = await donate(client, {
  dropId: 42n,
  hypeStakeWei: 10_000_000_000_000_000n
});
```

## Build Unsigned Donation Transaction

Use this when your app signs/broadcasts transactions outside the SDK:

```ts
import { buildDonateTx } from "fundstacks-headless-sdk";

const tx = buildDonateTx("0xYourNexusEngineAddress", {
  dropId: 42,
  hypeStakeWei: 10_000_000_000_000_000n
});

// tx = { to, data, value }
```

## API

- `createClient(config)`  
  Create a reusable SDK client with contract/network/signer settings.
- `buildDonateTx(contractAddress, input)`  
  Build a headless donation (`hype`) transaction payload.
- `donate(client, input)`  
  Execute donation through a provided wallet client.
- `NEXUS_ENGINE_ABI`  
  Minimal ABI surface used by this MVP.

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

- Add typed read helpers (`getDrop`, `getHypeRecord`, `isFlashWindowOpen`)
- Add create/withdraw/refund transaction builders
- Add event decode utilities

## License

MIT
