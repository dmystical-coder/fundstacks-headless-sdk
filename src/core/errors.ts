export type FundstacksErrorCode =
  | "INVALID_AMOUNT"
  | "INVALID_CAMPAIGN_ID"
  | "INVALID_UINT_STRING"
  | "MISSING_SBTC_ASSET"
  | "MISSING_TX_ID";

export class FundstacksError extends Error {
  readonly code: FundstacksErrorCode;

  constructor(message: string, code: FundstacksErrorCode) {
    super(message);
    this.name = "FundstacksError";
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
