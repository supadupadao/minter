import type { BaseFieldElement } from "@/components/Fields/FieldList.vue";
import { FieldsManager, type InputItem } from "./fields";

/**
 * Base extractor/parser class for contract ABI
 */
export class BaseDevTools {
  protected fields: FieldsManager;
  protected title?: string;

  constructor() {
    this.fields = new FieldsManager();
  }

  /**
   * List of fields
   * @returns 
   */
  public getFields(): InputItem[] {
    return this.fields.getFields();
  }

  public getTitle(): string | null{
    return this.title ?? null;
  }

  public async execute(elements: BaseFieldElement[]): Promise<boolean> {
    let success = true;
    for (const el of elements) {
      success = success && el.validate();
    }
    return success;
  }
}