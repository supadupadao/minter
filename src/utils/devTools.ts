import AddressField from "@/components/Fields/AddressField.vue";
import SliceField from "@/components/Fields/SliceField.vue";
import { TonConnectUI } from "@tonconnect/ui";
import { beginCell, type ABIField, type ABIGetter, type ABIReceiver, type ABIType, type Builder, type ContractProvider, type TupleItem } from "ton-core";
import type { CreateComponentPublicInstanceWithMixins } from "vue";

export interface BaseFieldInput {
  optional: boolean,
  label: string,
  placeholder?: string
  helpText?: string,
}

export type AnyFieldInput = { type: "any" };
export type EmptyFieldInput = { type: "empty" };
export type TextFieldInput = { type: "text" };
export type CoinsFieldInput = { type: "uint", format: "coins" } & BaseFieldInput;
export type UintFieldInput = { type: "uint", format: number } & BaseFieldInput;
export type StringFieldInput = { type: "string" } & BaseFieldInput;
export type SliceFieldInput = { type: "slice" } & BaseFieldInput;
export type AddressFieldInput = { type: "address" } & BaseFieldInput;
export type BoolFieldInput = { type: "bool" } & BaseFieldInput;
export type UnknownFieldInput = { type: "unknown", expected: string } & BaseFieldInput;

export type InputItem = AnyFieldInput
  | EmptyFieldInput
  | TextFieldInput
  | CoinsFieldInput
  | UintFieldInput
  | StringFieldInput
  | SliceFieldInput
  | AddressFieldInput
  | BoolFieldInput
  | UnknownFieldInput;

export interface SimpleFieldParameters {
  name: string;
  type: string;
  optional: boolean;
  format?: string | number | boolean;
};

export type BaseFieldElement = CreateComponentPublicInstanceWithMixins<{
  validate(): boolean,
  store(builder: Builder): void,
}>;

export class FieldsManager {
  private fields: InputItem[];

  constructor() {
    this.fields = [];
  }

  /**
   * List of fields
   * @returns 
   */
  public getFields(): InputItem[] {
    return this.fields;
  }

  /**
   * Parse `receiver` field of Contract ABI and store its fields to class attributes
   * @param receiver 
   * @param types 
   */
  public storeReceiverFields(receiver: ABIReceiver, types: ABIType[]) {
    switch (receiver.message.kind){
      case "any":
        this.storeAny();
        return;
      case "empty":
        this.storeEmpty();
        return;
      case "text":
        this.storeText();
        return;
      case "typed":
        const type = this.findTypeByName(types, receiver.message.type);
        if (!type) {
          return;
        }
        this.storeTypes(type);
    }
  }

  /**
   * Parse `getter` field of contract ABI and store its fields to class attributes
   * @param receiver 
   * @param types 
   */
  public storeGetterFields(getter: ABIGetter, types: ABIType[]) {
    if (!getter.arguments) {
      return;
    }

    for (const field of getter.arguments) {
      this.storeType(field);
    }
  }

  /**
   * Find contract type by its name
   * @param types 
   * @param typeName 
   * @returns 
   */
  public findTypeByName(types: ABIType[], typeName: string): ABIType | undefined {
    return types.find(t => t.name == typeName);
  }

  /**
   * Store `any` field
   */
  public storeAny() {
    this.fields.push({
      type: "any",
    });
  }

  /**
   * Store `empty` field
   */
  public storeEmpty() {
    this.fields.push({
      type: "empty"
    });
  }

  /**
   * Store `text` field
   */
  public storeText() {
    this.fields.push({
      type: "text"
    });
  }

  /**
   * Store `dict` field
   */
  public storeDict() {
    // TODO
  }

  /**
   * Store `address` field
   * @param type 
   */
  public storeAddress(type: SimpleFieldParameters) {
    this.fields.push({
      type: "address",
      label: type.name,
      optional: type.optional
    });
  }

  /**
   * Store `string` field
   * @param type 
   */
  public storeString(type: SimpleFieldParameters) {
    this.fields.push({
      type: "string",
      label: type.name,
      optional: type.optional
    });
  }

  /**
   * Store `uint` field
   * @param type 
   * @returns 
   */
  public storeUint(type: SimpleFieldParameters) {
    if (type.format == "coins") {
      this.fields.push({
        type: "uint",
        format: "coins",
        label: type.name,
        optional: type.optional,
      });
    } else if (typeof type.format == "number") {
      this.fields.push({
        type: "uint",
        format: type.format,
        label: type.name,
        optional: type.optional,
      });
    } else {
      return this.storeUnknown(type.type + type.format)
    }
  }

  /**
   * Store `slice` field
   * @param type 
   */
  public storeSlice(type: SimpleFieldParameters) {
    this.fields.push({
      type: "slice",
      label: type.name,
      optional: type.optional,
    });
  }

  /**
   * Store `unknown` field. For cases when class doesn't know how to handle specified type
   * @param expected 
   */
  public storeUnknown(expected: string) {
    // TODO
    this.fields.push({
      type: "unknown",
      expected: expected,
      label: "Unknown field",
      optional: false,
    })
  }

  /**
   * Store `simple` typed field
   * @param type 
   * @returns 
   */
  public storeSimple(type: SimpleFieldParameters) {
    switch (type.type) {
      case "address":
        return this.storeAddress(type);
      case "string":
        return this.storeString(type);
      case "uint":
        return this.storeUint(type);
      case "int":
        return this.storeUnknown(type.type); // TODO
      case "bool":
        return this.storeUnknown(type.type); // TODO
      case "cell":
        return this.storeUnknown(type.type); // TODO
      case "slice":
        return this.storeSlice(type);
      default:
        return this.storeUnknown(type.type);
    }
  }

  /**
   * Store single field
   * @param field 
   */
  public storeType(field: ABIField) {
    switch (field.type.kind) {
        case "dict":
          this.storeDict()
          break;
        case "simple":
          this.storeSimple({
            name: field.name,
            type: field.type.type,
            optional: field.type.optional ?? true,
            format: field.type.format ?? undefined
          });
          break;
      }
  }

  /**
   * Store field array
   * @param type 
   */
  public storeTypes(type: ABIType) {
    for (const field of type.fields) {
      this.storeType(field)
    }
  }
}

/**
 * Base extractor/parser class for contract ABI
 */
export class BaseDevTools {
  protected fields: FieldsManager;
  protected title?: string;
  protected elements: BaseFieldElement[];

  constructor() {
    this.fields = new FieldsManager();
    this.elements = [];
  }

  /**
   * List of fields
   * @returns 
   */
  public getFields(): InputItem[] {
    return this.fields.getFields();
  }

  public registerInput(el: BaseFieldElement) {
    console.log("NEW INPUT", this.elements.length, el);
    this.elements.push(el);
  }

  public getTitle(): string | null{
    return this.title ?? null;
  }

  public async execute(): Promise<boolean> {
    let success = true;
    for (const el of this.elements) {
      success &&= el.validate();
    }
    return success;
  }
}

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

  public override async execute(): Promise<boolean> {
    if (!await super.execute()) {
      return false;
    }

    const tx = beginCell();

    if (this.header) {
      tx.storeUint(this.header, 32);
    }

    for (const el of this.elements) {
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

interface GetterDevToolsOptions {
  getter: ABIGetter;
  types: ABIType[];
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

    this.fields.storeGetterFields(options.getter, options.types);
  }

  public override async execute(): Promise<boolean> {
    if (!await super.execute()) {
      return false;
    }

    const args = [] as TupleItem[];
    for (const el of this.elements) {
      args.push({
        type: "slice",
        cell: beginCell().store(el.store).endCell()
      })
    }

    const result = await this.provider.get(this.name, args);

    return true;
  }
}
