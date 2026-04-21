import { encodeFunctionData } from "viem";
import { NEXUS_ENGINE_ABI } from "./abi";
import type { FundstacksClient } from "./client";
import type { BuildDonateTxInput, DonateTx } from "./types";

function normalizeDropId(dropId: BuildDonateTxInput["dropId"]): bigint {
  return typeof dropId === "bigint" ? dropId : BigInt(dropId);
}

export function buildDonateTx(
  contractAddress: DonateTx["to"],
  input: BuildDonateTxInput
): DonateTx {
  return {
    to: contractAddress,
    data: encodeFunctionData({
      abi: NEXUS_ENGINE_ABI,
      functionName: "hype",
      args: [normalizeDropId(input.dropId)]
    }),
    value: input.hypeStakeWei
  };
}

export async function donate(
  client: FundstacksClient,
  input: BuildDonateTxInput
): Promise<`0x${string}`> {
  if (!client.walletClient) {
    throw new Error(
      "Wallet client is required to execute donate(). Use buildDonateTx() for unsigned transaction data."
    );
  }

  const tx = buildDonateTx(client.contractAddress, input);

  return client.walletClient.sendTransaction({
    account: client.account,
    to: tx.to,
    data: tx.data,
    value: tx.value,
    chain: client.chainId ? { id: client.chainId } : undefined
  });
}
