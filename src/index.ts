export { createClient, type FundstacksClient } from "./core/client";
export { buildDonateTx, donate } from "./core/donate";
export { FundstacksError } from "./core/errors";
export { defaultSbtcAssetForNetwork } from "./core/sbtc-defaults";
export { DONATE_FUNCTIONS } from "./core/abi";
export type { FundstacksErrorCode } from "./core/errors";
export type {
  BuildDonateTxInput,
  ContractCallOptions,
  DonationAsset,
  DonateOptions,
  FundstacksClientConfig,
  StacksAddress,
  StacksNetwork,
  WalletClient
} from "./core/types";
