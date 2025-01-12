import type { ContractABI, TonClient } from 'ton';
import { Address, Cell } from 'ton-core';
import {
  ORBS_IPFS_ENDPOINT,
  ORBS_IPFS_ENDPOINT_TESTNET,
  ORBS_REGISTRY_ID,
  ORBS_REGISTRY_ID_TESTNET,
  ORBS_SOURCES_REGISTRY,
  ORBS_SOURCES_REGISTRY_TESTNET,
} from './consts';
import { getStateInitByAddress } from '@/utils/tonHelpers';
import { getSourceItemAddress, getSourceItemData } from './registry';

type MainNet = {
  type: 'mainnet';
};
type TestNet = {
  type: 'testnet';
};
type CustomNet = {
  type: 'custom';
  registryId: string;
  orbsSourcesRegistry: Address;
  ipfsEndpoint: string;
};
type AllowedNetworks = MainNet | TestNet | CustomNet;

interface SourceItem {
  url: string;
  filename: string;
}

interface SourceResult {
  sources: SourceItem[];
}

interface SourceFile {
  code: string;
  abi: string;
}

interface ContractVerifierOptions {
  /**
   * Blockchain network settings
   */
  network: AllowedNetworks;
}

export class ContractSourcesFetcher {
  private registry: Address;
  private registryId: string;
  private ipfsEndpoint: string;

  constructor(opts: ContractVerifierOptions) {
    switch (opts.network.type) {
      case 'mainnet':
        this.registry = ORBS_SOURCES_REGISTRY;
        this.registryId = ORBS_REGISTRY_ID;
        this.ipfsEndpoint = ORBS_IPFS_ENDPOINT;
        break;
      case 'testnet':
        this.registry = ORBS_SOURCES_REGISTRY_TESTNET;
        this.registryId = ORBS_REGISTRY_ID_TESTNET;
        this.ipfsEndpoint = ORBS_IPFS_ENDPOINT_TESTNET;
        break;
      case 'custom':
        this.registry = opts.network.orbsSourcesRegistry;
        this.registryId = opts.network.registryId;
        this.ipfsEndpoint = opts.network.ipfsEndpoint;
        break;
    }
  }

  /**
   *
   * @param tonClient TonClient instnace
   * @param code
   * @returns
   */
  public async getSource(tonClient: TonClient, code: Cell): Promise<ContractABI | null> {
    const registryStateInit = await getStateInitByAddress(tonClient, this.registry);
    if (!registryStateInit) {
      return null;
    }
    const registryProvider = tonClient.provider(this.registry, registryStateInit);

    const sourceItemAddress = await getSourceItemAddress(registryProvider, this.registryId, code);
    const sourceItemStateInit = await getStateInitByAddress(tonClient, sourceItemAddress);
    if (!sourceItemStateInit) {
      return null;
    }
    const sourceItemProvider = tonClient.provider(sourceItemAddress, sourceItemStateInit);

    const sourcesUrl = await getSourceItemData(sourceItemProvider);
    const sources = await this.fetchByIpfs<SourceResult>(sourcesUrl);

    for (const sourceItem of sources.sources) {
      if (sourceItem.filename.endsWith('.pkg')) {
        const sourceFile = await this.fetchByIpfs<SourceFile>(sourceItem.url);
        const sourceCodeCell = Cell.fromBase64(sourceFile.code);

        if (sourceCodeCell.toBoc().toString('base64') == code.toBoc().toString('base64')) {
          return JSON.parse(sourceFile.abi);
        }
      }
    }

    return null;
  }

  /**
   * Convert ipfs url to http via ipfs http gateway
   * @param ipfsLink ipfs url
   * @returns http link
   */
  private replaceIpfsLink(ipfsLink: string): string {
    return ipfsLink.replace('ipfs://', this.ipfsEndpoint);
  }

  /**
   * Send request to IPFS url via http gateway and parses result to JSON
   * @param ipfsLink ipfs url
   * @returns JSON parsed result
   */
  private async fetchByIpfs<R>(ipfsLink: string): Promise<R> {
    const url = this.replaceIpfsLink(ipfsLink);
    const result = await fetch(url);
    return await result.json();
  }
}
