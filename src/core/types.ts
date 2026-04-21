export type StacksAddress = string;
export type StacksNetwork = "mainnet" | "testnet" | "devnet";
export type DonationAsset = "stx" | "sbtc";

export interface ContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: unknown[];
  network?: StacksNetwork | string;
  anchorMode?: number;
  postConditions?: unknown[];
  postConditionMode?: number | "allow" | "deny";
  sponsored?: boolean;
  onFinish?: (data: { txId: string }) => void;
  onCancel?: () => void;
}

export interface WalletClient {
  callContract: (
    request: ContractCallOptions
  ) => Promise<string | { txid?: string; txId?: string } | void>;
}

export interface FundstacksClientConfig {
  contractAddress: string;
  contractName: string;
  network?: StacksNetwork;
  walletClient?: WalletClient;
}

export interface BuildDonateTxInput {
  campaignId: bigint | number | string;
  amount: bigint | number | string;
  asset: DonationAsset;
  senderAddress: StacksAddress;
  sbtcAsset?: string;
}
