import { DONATE_FUNCTIONS } from "./abi";
import type { FundstacksClient } from "./client";
import type { BuildDonateTxInput, ContractCallOptions } from "./types";

const ANCHOR_MODE_ANY = 3;
const POST_CONDITION_MODE_DENY = "deny";

function normalizeUint(
  value: BuildDonateTxInput["campaignId"] | BuildDonateTxInput["amount"]
): bigint {
  return typeof value === "bigint" ? value : BigInt(value);
}

function toSbtcPostCondition(input: BuildDonateTxInput): unknown {
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
    amount: normalizeUint(input.amount)
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
  const campaignId = normalizeUint(input.campaignId);
  const amount = normalizeUint(input.amount);
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
      : [toSbtcPostCondition(input)]
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
