import type { Address } from "ton-core";

// https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-attributes
export interface MetadataDict {
  uri?: string,
  name?: string,
  description?: string,
  image?: string,
  image_data?: string, // binary?
  symbol?: string,
  decimals?: string,
  amount_style?: "n" | "n-of-total" | "%",
  render_type?: "currency" | "game",
}

export interface JettonMasterData {
  totalSupply: bigint,
  mintable: boolean,
  adminAddress: Address,
}