import type { FundstacksClientConfig } from "./types";

export interface FundstacksClient {
  contractAddress: FundstacksClientConfig["contractAddress"];
  contractName: FundstacksClientConfig["contractName"];
  network?: FundstacksClientConfig["network"];
  sbtcAsset?: FundstacksClientConfig["sbtcAsset"];
  strictTxId?: FundstacksClientConfig["strictTxId"];
  walletClient?: FundstacksClientConfig["walletClient"];
}

export function createClient(config: FundstacksClientConfig): FundstacksClient {
  return {
    contractAddress: config.contractAddress,
    contractName: config.contractName,
    network: config.network,
    sbtcAsset: config.sbtcAsset,
    strictTxId: config.strictTxId,
    walletClient: config.walletClient
  };
}
