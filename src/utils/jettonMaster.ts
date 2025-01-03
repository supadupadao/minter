import type { Address, Contract, ContractProvider } from "ton-core";

export class SupaDupaJettonMaster implements Contract {
  readonly address: Address;
  constructor(address: Address) {
    this.address = address;
  }

  async jettonData(provider: ContractProvider) {
    const res = await provider.get('get_jetton_data', []);
    const totalSupply = res.stack.readBigNumber();
    const mintable = res.stack.readBoolean();
    const adminAddress = res.stack.readAddress();
    const content = res.stack.readCell();
    const walletCode = res.stack.readCell();
    return {
      totalSupply,
      mintable,
      adminAddress,
      content,
      walletCode
    };
  }

  async supportedInterfaces(provider: ContractProvider) {
    const res = await provider.get('supported_interfaces', []);
    const interfaces = [];

    // Validate interfaces
    const firstInterface = res.stack.readBigNumber();
    if (firstInterface !== 123515602279859691144772641439386770278n) {
      // TODO error handling
      throw new Error("Invalid interfaces");
    }
    interfaces.push(firstInterface);

    const remaining = res.stack.remaining;
    for (let i = 0; i < remaining; i++) {
      interfaces.push(res.stack.readBigNumber());
    }

    return interfaces;
  }
}