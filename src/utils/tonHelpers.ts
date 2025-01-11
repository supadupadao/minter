import type { TonClient } from "ton";
import { Address, Cell } from "ton-core";
import { retry } from "./retry";

/**
 * Convert Buffer to BigInt
 * @param buffer Buffer which will be converted to BigInt
 * @returns bigint
 */
export function bigIntFromBuffer(buffer: Buffer): bigint {
  return BigInt(`0x${buffer.toString("hex")}`);
}

/**
 * Alias to `Address.parse` with error mapping
 * @param {string} address TON contract address in any format
 * @returns {Address | null} null if address is invalid, otherwise parsed Address
 */
export function parseAddress(address: string): Address | null {
  try {
    return Address.parse(address)
  } catch {
    return null
  }
}

/**
 * Alias to `tonClient.getContractState` with checking if account is exists
 * @param tonClient TonClient instance
 * @param address TON Address
 * @returns StateInit if everythink Ok, otherwise null
 */
export async function getStateInitByAddress(tonClient: TonClient, address: Address): Promise<{ code: Cell, data: Cell} | null> {
  try {
    const contractState = await retry(() => tonClient.getContractState(address));

    if (contractState.state == "uninitialized") {
      return null
    }

    const code = Cell.fromBase64(contractState.code?.toString("base64") as string);
    const data = Cell.fromBase64(contractState.data?.toString("base64") as string);

    return { code, data };
  } catch {
    return null;
  }
}
