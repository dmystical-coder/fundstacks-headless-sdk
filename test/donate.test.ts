import { describe, expect, it, vi } from "vitest";
import { buildDonateTx, createClient, donate } from "../src/index";

describe("buildDonateTx", () => {
  it("encodes a payable hype transaction", () => {
    const tx = buildDonateTx("0x000000000000000000000000000000000000dead", {
      dropId: 12,
      hypeStakeWei: 10000000000000000n
    });

    expect(tx.to).toBe("0x000000000000000000000000000000000000dead");
    expect(tx.value).toBe(10000000000000000n);
    expect(tx.data.startsWith("0x")).toBe(true);
    expect(tx.data.length).toBeGreaterThan(10);
  });
});

describe("donate", () => {
  it("sends transaction through wallet client", async () => {
    const sendTransaction = vi
      .fn()
      .mockResolvedValue("0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1");

    const client = createClient({
      contractAddress: "0x000000000000000000000000000000000000dead",
      chainId: 10143,
      account: "0x000000000000000000000000000000000000beef",
      walletClient: {
        sendTransaction
      }
    });

    const hash = await donate(client, {
      dropId: "42",
      hypeStakeWei: 5000000000000000n
    });

    expect(hash).toMatch(/^0x[0-9a-f]+$/);
    expect(sendTransaction).toHaveBeenCalledTimes(1);
  });

  it("throws when no wallet client is provided", async () => {
    const client = createClient({
      contractAddress: "0x000000000000000000000000000000000000dead"
    });

    await expect(
      donate(client, {
        dropId: 1n,
        hypeStakeWei: 1n
      })
    ).rejects.toThrow("Wallet client is required");
  });
});
