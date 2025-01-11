import type { TonConnectUI } from "@tonconnect/ui";
import { beginCell, type ABIReceiver, type ABIType } from "ton-core";
import { BaseDevTools } from "./base";
import type { BaseFieldElement } from "@/components/Fields/FieldList.vue";

interface ReceiverDevToolsOptions {
  receiver: ABIReceiver;
  types: ABIType[];
  tonConnectUI: TonConnectUI;
  address: string;
  tonAmount: bigint;
}

export class ReceiverDevTools extends BaseDevTools {
  private header?: number;
  private address: string;
  private tonConnectUI: TonConnectUI;
  private tonAmount: bigint;

  constructor(options: ReceiverDevToolsOptions) {
    super();

    this.tonConnectUI = options.tonConnectUI;
    this.address = options.address;
    this.tonAmount = options.tonAmount;

    if (options.receiver.message.kind == "typed") {
      const type = this.fields.findTypeByName(options.types, options.receiver.message.type);
      if (type) {
        this.header = type.header ?? undefined;
        this.title = type.name;
      }
    }

    this.fields.storeReceiverFields(options.receiver, options.types);
  }

  public override async execute(elements: BaseFieldElement[]): Promise<boolean> {
    if (!await super.execute(elements)) {
      return false;
    }

    const tx = beginCell();

    if (this.header) {
      tx.storeUint(this.header, 32);
    }

    for (const el of elements) {
      tx.store(el.store);
    }

    await this.tonConnectUI.sendTransaction(
      {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: this.address,
            amount: this.tonAmount.toString(),
            payload: tx.endCell().toBoc().toString("base64"),
          }
        ]
      }
    );

    return true;
  }
}
