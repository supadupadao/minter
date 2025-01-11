import type { BaseFieldElement } from "@/components/Fields/FieldList.vue";
import { beginCell, type ABIGetter, type ContractProvider, type TupleItem } from "ton-core";
import { BaseDevTools } from "./base";

interface GetterDevToolsOptions {
  getter: ABIGetter;
  provider: ContractProvider;
}

export class GetterDevTools extends BaseDevTools {
  private name: string;
  private provider: ContractProvider;

  constructor(options: GetterDevToolsOptions) {
    super();

    this.provider = options.provider;

    this.name = options.getter.name;
    this.title = options.getter.name;

    this.fields.storeGetterFields(options.getter);
  }

  public override async execute(elements: BaseFieldElement[]): Promise<boolean> {
    if (!await super.execute(elements)) {
      return false;
    }

    const args = [] as TupleItem[];
    for (const el of elements) {
      args.push({
        type: "slice",
        cell: beginCell().store(el.store).endCell()
      })
    }

    await this.provider.get(this.name, args); // TODO

    return true;
  }
}
