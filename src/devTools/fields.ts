import type { ABIField, ABIGetter, ABIReceiver, ABIType } from 'ton-core';

export interface BaseFieldInput {
  optional: boolean;
  label: string;
  placeholder?: string;
  helpText?: string;
}

export type AnyFieldInput = { type: 'any' };
export type EmptyFieldInput = { type: 'empty' };
export type TextFieldInput = { type: 'text' };
export type CoinsFieldInput = { type: 'coins' };
export type UintFieldInput = { type: 'uint'; format: number };
export type IntFieldInput = { type: 'int'; format: number };
export type StringFieldInput = { type: 'string' };
export type CellFieldInput = { type: 'cell'; format: 'remaining' | null };
export type SliceFieldInput = { type: 'slice'; format: 'remaining' | null };
export type AddressFieldInput = { type: 'address' };
export type BoolFieldInput = { type: 'bool' };
export type UnknownFieldInput = { type: 'unknown'; expected: string };

export type InputItem =
  | AnyFieldInput
  | EmptyFieldInput
  | TextFieldInput
  | (CoinsFieldInput & BaseFieldInput)
  | (UintFieldInput & BaseFieldInput)
  | (IntFieldInput & BaseFieldInput)
  | (StringFieldInput & BaseFieldInput)
  | (CellFieldInput & BaseFieldInput)
  | (SliceFieldInput & BaseFieldInput)
  | (AddressFieldInput & BaseFieldInput)
  | (BoolFieldInput & BaseFieldInput)
  | (UnknownFieldInput & BaseFieldInput);

export interface SimpleFieldParameters {
  name: string;
  type: string;
  optional: boolean;
  format?: string | number | boolean;
}

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
    switch (receiver.message.kind) {
      case 'any':
        this.storeAny();
        return;
      case 'empty':
        this.storeEmpty();
        return;
      case 'text':
        this.storeText();
        return;
      case 'typed':
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
  public storeGetterFields(getter: ABIGetter) {
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
    return types.find((t) => t.name == typeName);
  }

  /**
   * Store `any` field
   */
  public storeAny() {
    this.fields.push({
      type: 'any',
    });
  }

  /**
   * Store `empty` field
   */
  public storeEmpty() {
    this.fields.push({
      type: 'empty',
    });
  }

  /**
   * Store `text` field
   */
  public storeText() {
    this.fields.push({
      type: 'text',
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
      type: 'address',
      label: type.name,
      optional: type.optional,
    });
  }

  /**
   * Store `string` field
   * @param type
   */
  public storeString(type: SimpleFieldParameters) {
    this.fields.push({
      type: 'string',
      label: type.name,
      optional: type.optional,
    });
  }

  /**
   * Store `uint` field
   * @param type
   * @returns
   */
  public storeUint(type: SimpleFieldParameters) {
    if (type.format == 'coins') {
      this.fields.push({
        type: 'coins',
        label: type.name,
        optional: type.optional,
      });
    } else if (typeof type.format == 'number') {
      this.fields.push({
        type: 'uint',
        format: type.format,
        label: type.name,
        optional: type.optional,
      });
    } else {
      return this.storeUnknown(type.type + type.format);
    }
  }

  /**
   * Store `int` field
   * @param type
   * @returns
   */
  public storeInt(type: SimpleFieldParameters) {
    if (typeof type.format == 'number') {
      this.fields.push({
        type: 'int',
        format: type.format,
        label: type.name,
        optional: type.optional,
      });
    }
  }

  /**
   * Store `bool` field
   * @param type
   */
  public storeBoolean(type: SimpleFieldParameters) {
    this.fields.push({
      type: 'bool',
      label: type.name,
      optional: type.optional,
    });
  }

  /**
   * Store `cell` field
   * @param type
   */
  public storeCell(type: SimpleFieldParameters) {
    this.fields.push({
      type: 'cell',
      label: type.name,
      optional: type.optional || type.format == 'remainder',
      format: type.format == 'remainder' ? 'remaining' : null,
    });
  }

  /**
   * Store `slice` field
   * @param type
   */
  public storeSlice(type: SimpleFieldParameters) {
    this.fields.push({
      type: 'slice',
      label: type.name,
      optional: type.optional || type.format == 'remainder',
      format: type.format == 'remainder' ? 'remaining' : null,
    });
  }

  /**
   * Store `unknown` field. For cases when class doesn't know how to handle specified type
   * @param expected
   */
  public storeUnknown(expected: string) {
    // TODO
    this.fields.push({
      type: 'unknown',
      expected: expected,
      label: 'Unknown field',
      optional: false,
    });
  }

  /**
   * Store `simple` typed field
   * @param type
   * @returns
   */
  public storeSimple(type: SimpleFieldParameters) {
    switch (type.type) {
      case 'address':
        return this.storeAddress(type);
      case 'string':
        return this.storeString(type);
      case 'uint':
        return this.storeUint(type);
      case 'int':
        return this.storeInt(type);
      case 'bool':
        return this.storeBoolean(type);
      case 'cell':
        return this.storeCell(type);
      case 'slice':
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
      case 'dict':
        this.storeDict();
        break;
      case 'simple':
        this.storeSimple({
          name: field.name,
          type: field.type.type,
          optional: field.type.optional ?? true,
          format: field.type.format ?? undefined,
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
      this.storeType(field);
    }
  }
}
