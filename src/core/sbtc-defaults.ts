import type { StacksNetwork } from "./types";

/**
 * Default SIP-010 `sbtc-token` contract id for known networks, per
 * [Stacks Clarinet sBTC network mapping](https://docs.stacks.co/clarinet/integrations/sbtc).
 * `devnet` and unknown networks have no default — set `sbtcAsset` on the client or per donation.
 */
export function defaultSbtcAssetForNetwork(
  network: StacksNetwork | string | undefined
): string | undefined {
  if (network === "mainnet") {
    return "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token";
  }
  if (network === "testnet") {
    return "ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token";
  }
  return undefined;
}
