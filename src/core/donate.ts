import { DONATE_FUNCTIONS } from "./abi";
import type { FundstacksClient } from "./client";
import { FundstacksError } from "./errors";
import type { BuildDonateTxInput, ContractCallOptions } from "./types";

const ANCHOR_MODE_ANY = 3;
const POST_CONDITION_MODE_DENY = "deny";

function parseUintString(
  value: BuildDonateTxInput["campaignId"] | BuildDonateTxInput["amount"]
): bigint {
  if (typeof value === "bigint") {
    return value;
  }
  try {
    return BigInt(value);
  } catch {
    throw new FundstacksError("Value is not a valid unsigned integer string", "INVALID_UINT_STRING");
  }
}

function parseDonationAmount(value: BuildDonateTxInput["amount"]): bigint {
  const amount = parseUintString(value);
  if (amount <= 0n) {
    throw new FundstacksError("amount must be greater than zero", "INVALID_AMOUNT");
  }
  return amount;
}

function parseCampaignId(value: BuildDonateTxInput["campaignId"]): bigint {
  const id = parseUintString(value);
  if (id < 1n) {
    throw new FundstacksError("campaignId must be at least 1", "INVALID_CAMPAIGN_ID");
  }
  return id;
}

function toSbtcPostCondition(input: BuildDonateTxInput, amount: bigint): unknown {
  if (!input.sbtcAsset) {
    throw new Error(
      "sbtcAsset is required when building an sBTC donation transaction."
    );
  }

  return {
    type: "ft-postcondition",
    address: input.senderAddress,
    condition: "eq",
    asset: input.sbtcAsset,
    amount
  };
}

function toUintCv(value: bigint): { type: "uint"; value: bigint } {
  return {
    type: "uint",
    value
  };
}

function toStxPostCondition(
  senderAddress: string,
  amount: bigint
): {
  type: "stx-postcondition";
  address: string;
  condition: "eq";
  amount: bigint;
} {
  return {
    type: "stx-postcondition",
    address: senderAddress,
    condition: "eq",
    amount
  };
}

export function buildDonateTx(client: FundstacksClient, input: BuildDonateTxInput): ContractCallOptions {
  const campaignId = parseCampaignId(input.campaignId);
  const amount = parseDonationAmount(input.amount);
  const isStx = input.asset === "stx";

  return {
    anchorMode: ANCHOR_MODE_ANY,
    postConditionMode: POST_CONDITION_MODE_DENY,
    contractAddress: client.contractAddress,
    contractName: client.contractName,
    network: client.network,
    functionName: isStx ? DONATE_FUNCTIONS.stx : DONATE_FUNCTIONS.sbtc,
    functionArgs: [toUintCv(campaignId), toUintCv(amount)],
    postConditions: isStx
      ? [toStxPostCondition(input.senderAddress, amount)]
      : [toSbtcPostCondition(input, amount)]
  };
}

export async function donate(
  client: FundstacksClient,
  input: BuildDonateTxInput
): Promise<string | undefined> {
  if (!client.walletClient) {
    throw new Error(
      "Wallet client is required to execute donate(). Use buildDonateTx() for unsigned contract call options."
    );
  }

  const txOptions = buildDonateTx(client, input);
  const result = await client.walletClient.callContract(txOptions);

  if (typeof result === "string") {
    return result;
  }

  if (result && typeof result === "object") {
    return result.txid ?? result.txId;
  }

  return undefined;
}
