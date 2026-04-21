export type Address = `0x${string}`;

export interface FundstacksClientConfig {
  contractAddress: Address;
  chainId?: number;
  walletClient?: {
    sendTransaction: (request: {
      account?: Address;
      to: Address;
      data: `0x${string}`;
      value: bigint;
      chain?: { id: number };
    }) => Promise<`0x${string}`>;
  };
  account?: Address;
}

export interface BuildDonateTxInput {
  dropId: bigint | number | string;
  hypeStakeWei: bigint;
}

export interface DonateTx {
  to: Address;
  data: `0x${string}`;
  value: bigint;
}
