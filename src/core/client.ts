import type { FundstacksClientConfig } from "./types";

export interface FundstacksClient {
  contractAddress: FundstacksClientConfig["contractAddress"];
  contractName: FundstacksClientConfig["contractName"];
  network?: FundstacksClientConfig["network"];
  walletClient?: FundstacksClientConfig["walletClient"];
}

export function createClient(config: FundstacksClientConfig): FundstacksClient {
  return {
    contractAddress: config.contractAddress,
    contractName: config.contractName,
    network: config.network,
    walletClient: config.walletClient
  };
}
