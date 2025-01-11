import { retry } from "@/utils/retry";
import { bigIntFromBuffer } from "@/utils/tonHelpers";
import type { Address, Cell, ContractProvider } from "ton-core";
import { sha256 } from "ton-crypto";

export async function getSourceItemAddress(provider: ContractProvider, registryId: string, code: Cell): Promise<Address> {
  const result = await retry(async () => provider.get("get_source_item_address", [
    {
      type: "int",
      value: bigIntFromBuffer(await sha256(registryId))
    },
    {
      type: "int",
      value: bigIntFromBuffer(code.hash())
    },
  ]));
  return result.stack.readAddress()
}

export async function getSourceItemData(provider: ContractProvider): Promise<string> {
  const result = await retry (() => provider.get("get_source_item_data", []));
  const content = result.stack.skip(3).readCell().beginParse();
  return content.loadStringTail();
}