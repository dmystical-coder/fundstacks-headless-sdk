import { describe, expect, it, vi } from "vitest";
import {
  buildDonateTx,
  createClient,
  donate,
  FundstacksError,
  type FundstacksErrorCode
} from "../src/index";

const validDonateStx = {
  amount: 1_000_000n,
  asset: "stx" as const,
  senderAddress: "ST2J8EVYHP2JXQ6XEAH2V7W4N19WQQ9Q0DXM1ANQG"
};

function expectThrowsFundstacks(fn: () => void, code: FundstacksErrorCode) {
  try {
    fn();
    expect.fail("expected throw");
  } catch (e) {
    expect(e).toBeInstanceOf(FundstacksError);
    expect((e as FundstacksError).code).toBe(code);
  }
}

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

  it("throws FundstacksError INVALID_UINT_STRING for non-numeric amount string", () => {
    const client = createClient({
      contractAddress: "ST000000000000000000002AMW42H",
      contractName: "fundraising"
    });
    expectThrowsFundstacks(
      () => buildDonateTx(client, { ...validDonateStx, campaignId: 1, amount: "abc" }),
      "INVALID_UINT_STRING"
    );
  });

  it("throws FundstacksError INVALID_UINT_STRING for non-numeric campaignId string", () => {
    const client = createClient({
      contractAddress: "ST000000000000000000002AMW42H",
      contractName: "fundraising"
    });
    expectThrowsFundstacks(
      () => buildDonateTx(client, { ...validDonateStx, campaignId: "nope", amount: 1n }),
      "INVALID_UINT_STRING"
    );
  });

  it("throws FundstacksError INVALID_AMOUNT for zero or negative amount", () => {
    const client = createClient({
      contractAddress: "ST000000000000000000002AMW42H",
      contractName: "fundraising"
    });
    for (const amount of [0, 0n, -1, -1n, "-5"] as const) {
      expectThrowsFundstacks(
        () => buildDonateTx(client, { ...validDonateStx, campaignId: 1, amount }),
        "INVALID_AMOUNT"
      );
    }
  });

  it("throws FundstacksError INVALID_CAMPAIGN_ID for campaignId below 1", () => {
    const client = createClient({
      contractAddress: "ST000000000000000000002AMW42H",
      contractName: "fundraising"
    });
    for (const campaignId of [0, 0n, -1, -3n, "-1"] as const) {
      expectThrowsFundstacks(
        () => buildDonateTx(client, { ...validDonateStx, campaignId, amount: 1n }),
        "INVALID_CAMPAIGN_ID"
      );
    }
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

  it("rejects invalid input before calling wallet (same as buildDonateTx)", async () => {
    const callContract = vi.fn();
    const client = createClient({
      contractAddress: "ST000000000000000000002AMW42H",
      contractName: "fundraising",
      walletClient: { callContract }
    });

    await expect(
      donate(client, {
        campaignId: 1,
        amount: 0n,
        asset: "stx",
        senderAddress: "ST2J8EVYHP2JXQ6XEAH2V7W4N19WQQ9Q0DXM1ANQG"
      })
    ).rejects.toMatchObject({ code: "INVALID_AMOUNT" });
    expect(callContract).not.toHaveBeenCalled();
  });
});
