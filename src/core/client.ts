import type { FundstacksClientConfig } from "./types";

export interface FundstacksClient {
  contractAddress: FundstacksClientConfig["contractAddress"];
  chainId?: number;
  walletClient?: FundstacksClientConfig["walletClient"];
  account?: FundstacksClientConfig["account"];
}

export function createClient(config: FundstacksClientConfig): FundstacksClient {
  return {
    contractAddress: config.contractAddress,
    chainId: config.chainId,
    walletClient: config.walletClient,
    account: config.account
  };
}
