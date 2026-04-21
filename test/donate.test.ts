import { describe, expect, it, vi } from "vitest";
import { buildDonateTx, createClient, donate } from "../src/index";

describe("buildDonateTx", () => {
  it("builds a donate-stx contract call", () => {
    const client = createClient({
      contractAddress: "ST000000000000000000002AMW42H",
      contractName: "fundraising"
    });

    const tx = buildDonateTx(client, {
      campaignId: 12,
      amount: 1_000_000n,
      asset: "stx",
      senderAddress: "ST2J8EVYHP2JXQ6XEAH2V7W4N19WQQ9Q0DXM1ANQG"
    });

    expect(tx.contractAddress).toBe("ST000000000000000000002AMW42H");
    expect(tx.contractName).toBe("fundraising");
    expect(tx.functionName).toBe("donate-stx");
    expect(tx.functionArgs).toHaveLength(2);
    expect(tx.postConditions).toHaveLength(1);
  });
});

describe("donate", () => {
  it("executes contract call through wallet client", async () => {
    const callContract = vi.fn().mockResolvedValue({
      txid: "0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1"
    });

    const client = createClient({
      contractAddress: "ST000000000000000000002AMW42H",
      contractName: "fundraising",
      network: "testnet",
      walletClient: {
        callContract
      }
    });

    const hash = await donate(client, {
      campaignId: "42",
      amount: 500000n,
      asset: "stx",
      senderAddress: "ST2J8EVYHP2JXQ6XEAH2V7W4N19WQQ9Q0DXM1ANQG"
    });

    expect(hash).toMatch(/^0x[0-9a-f]+$/);
    expect(callContract).toHaveBeenCalledTimes(1);
  });

  it("throws when no wallet client is provided", async () => {
    const client = createClient({
      contractAddress: "ST000000000000000000002AMW42H",
      contractName: "fundraising"
    });

    await expect(
      donate(client, {
        campaignId: 1n,
        amount: 1n,
        asset: "stx",
        senderAddress: "ST2J8EVYHP2JXQ6XEAH2V7W4N19WQQ9Q0DXM1ANQG"
      })
    ).rejects.toThrow("Wallet client is required");
  });
});
