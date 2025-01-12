import { Cell, Dictionary } from 'ton-core';
import type { MetadataDict } from './types';
import { sha256 } from 'ton-crypto';

export type Dict = Dictionary<Buffer, Cell>;
export const DictKey = Dictionary.Keys.Buffer(32);
export const DictValue = Dictionary.Values.Cell();

export async function getValue(dict: Dict, key: string): Promise<Cell | undefined> {
  return dict.get(await sha256(key));
}

export async function getString(dict: Dict, key: string): Promise<string | undefined> {
  const value = await getValue(dict, key);
  return value?.beginParse().loadStringRefTail();
}

export async function parseMetadata(content: Cell): Promise<MetadataDict> {
  const result = {} as MetadataDict;
  const parser = content.beginParse();

  const onchainFlag = parser.loadUint(8);
  if (onchainFlag === 0) {
    /// On-Chain metadata
    const metadataDict = parser.loadDict(DictKey, DictValue);

    result.name = await getString(metadataDict, 'name');
    result.description = await getString(metadataDict, 'description');
    result.symbol = await getString(metadataDict, 'symbol');
  }
  if (onchainFlag === 1) {
    /// Off-Chain metadata
    /// TODO
  }

  return result;
}
