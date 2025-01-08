<template>
  <h2 class="subtitle">{{ title || $t("message.DevTools.ChooseOperation") }}</h2>

  <div v-if="!abi.type">
    {{ $t("message.DevTools.DefaultText") }}
  </div>


  <div v-for="(input, index) in inputs" v-bind:key="`${title}_${index}`">
    <StringField v-if="input.type == 'string'" v-bind="input" :ref="el => refItems.push(el as BaseFieldElement)" />
    <CoinsField v-else-if="input.type == 'uint' && input.format == 'coins'" v-bind="input"
      :ref="el => refItems.push(el as BaseFieldElement)" />
    <UintField v-else-if="input.type == 'uint'" v-bind="input" :ref="el => refItems.push(el as BaseFieldElement)" />
    <SliceField v-else-if="input.type == 'slice'" v-bind="input" :ref="el => refItems.push(el as BaseFieldElement)" />
    <AddressField v-else-if="input.type == 'address'" v-bind="input"
      :ref="el => refItems.push(el as BaseFieldElement)" />
    <BooleanField v-else-if="input.type == 'bool'" v-bind="input" :ref="el => refItems.push(el as BaseFieldElement)" />
    <UnknownField v-else v-bind="input" :ref="el => refItems.push(el as BaseFieldElement)" />
  </div>

  <div v-if="abi.type == 'getter'" class="control">
    <button class="button is-link" @click="computeGetter">Compute</button>
  </div>
  <div v-if="abi.type == 'receiver'" class="control">
    <button class="button is-primary" @click="sendTransaction">Send transaction</button>
  </div>

  <div v-if="getterResult" class="content">
    <ul>
      <li v-for="(item, index) in getterResult" v-bind:key="index"><b>{{ item.type }}</b>: {{ item.value }}</li>
    </ul>
  </div>

</template>

<script lang="ts">
import { beginCell, Builder, toNano, type ABIGetter, type ABIReceiver, type ABIType, type ContractProvider, type TupleItem } from 'ton-core';
import StringField from '../Fields/StringField.vue';
import CoinsField from '../Fields/CoinsField.vue';
import UintField from '../Fields/UintField.vue';
import UnknownField from '../Fields/UnknownField.vue';
import SliceField from '../Fields/SliceField.vue';
import AddressField from '../Fields/AddressField.vue';
import BooleanField from '../Fields/BooleanField.vue';
import type { CreateComponentPublicInstanceWithMixins } from 'vue';

type BaseFieldElement = CreateComponentPublicInstanceWithMixins<{
  validate(): boolean,
  store(builder: Builder): void,
}>;

interface BaseFieldInput {
  optional: boolean,
  label: string,
  placeholder?: string
  helpText?: string
}

type AnyFieldInput = { type: "any" } & BaseFieldInput;
type EmptyFieldInput = { type: "empty" } & BaseFieldInput;
type TextFieldInput = { type: "text" } & BaseFieldInput;
type CoinsFieldInput = { type: "uint", format: "coins" } & BaseFieldInput;
type UintFieldInput = { type: "uint", format: number } & BaseFieldInput;
type StringFieldInput = { type: "string" } & BaseFieldInput;
type SliceFieldInput = { type: "slice" } & BaseFieldInput;
type AddressFieldInput = { type: "address" } & BaseFieldInput;
type BoolFieldInput = { type: "bool" } & BaseFieldInput;
type UnknownFieldInput = { type: "unknown", expected: string } & BaseFieldInput;

type InputItem = AnyFieldInput
  | EmptyFieldInput
  | TextFieldInput
  | CoinsFieldInput
  | UintFieldInput
  | StringFieldInput
  | SliceFieldInput
  | AddressFieldInput
  | BoolFieldInput
  | UnknownFieldInput;

export default {
  components: { StringField, CoinsField, UintField, SliceField, AddressField, BooleanField, UnknownField },
  props: {
    types: {
      type: Object as () => ABIType[],
      required: true,
    },
    provider: {
      type: Object as () => ContractProvider,
      required: true,
    }
  },
  data() {
    return {
      abi: {} as { type: "receiver", receiver: ABIReceiver } | { type: "getter", getter: ABIGetter },
      getterResult: [] as { type: string, value: string }[],
      refItems: [] as BaseFieldElement[],
    }
  },
  beforeUpdate() {
    this.refItems = [];
  },
  computed: {
    title() {
      if (this.abi.type == "getter") {
        return this.abi.getter.name
      }

      if (this.abi.type == "receiver" && this.abi.receiver.message.kind == "typed") {
        return this.abi.receiver.message.type
      }

      return null
    },
    inputs(): InputItem[] {
      const result = [] as InputItem[];

      if (this.abi.type == "getter" && this.abi.getter.arguments) {
        for (const argument of this.abi.getter.arguments) {
          switch (argument.type.kind) {
            case "dict":
              result.push({
                type: "unknown",
                expected: "dict",
                optional: false,
                label: argument.name,
              });
              // TODO
              break;
            case "simple":
              switch (argument.type.type) {
                // TODO
                case "string":
                  result.push({
                    type: "string",
                    optional: argument.type.optional || false,
                    label: argument.name
                  });
                  break;
                case "uint":
                  if (argument.type.format == "coins") {
                    result.push({
                      type: "uint",
                      format: "coins",
                      optional: argument.type.optional || false,
                      label: argument.name
                    });
                  }
                  else if (typeof argument.type.format == 'number') {
                    result.push({
                      type: "uint",
                      format: argument.type.format,
                      optional: argument.type.optional || false,
                      label: argument.name
                    });
                  }
                  else {
                    result.push({
                      type: "unknown",
                      expected: "uint with" + argument.type.format,
                      optional: false,
                      label: argument.name,
                    });
                  }
                  break;
                case "slice":
                  result.push({
                    type: "slice",
                    optional: false,
                    label: argument.name,
                  })
                  break;
                case "address":
                  result.push({
                    type: "address",
                    optional: false,
                    label: argument.name,
                  })
                  break;
                case "bool":
                  result.push({
                    type: "bool",
                    optional: true,
                    label: argument.name,
                  })
                  break;
                default:
                  result.push({
                    type: "unknown",
                    expected: argument.type.type,
                    optional: false,
                    label: argument.name,
                  });
                  break;
              }
          }
        }
      }

      if (this.abi.type == "receiver") {
        switch (this.abi.receiver.message.kind) {
          case "any":
            result.push({
              type: "any",
              optional: false,
              label: "Any message" // TODO translate
            })
            // TODO support any
            break;
          case "empty":
            result.push({
              type: "empty",
              optional: false,
              label: "Empty message" // TODO translate
            })
            // TODO support empty
            break;
          case "text":
            result.push({
              type: "text",
              optional: false,
              label: "Text message" // TODO translate
            })
            // TODO support empty
            break;
          case "typed":
            const typeName = this.abi.receiver.message.type;
            const type = this.types.find((value) => value.name === typeName);
            if (type) {
              for (const field of type.fields) {
                switch (field.type.kind) {
                  case "dict":
                    result.push({
                      type: "unknown",
                      expected: "dict",
                      optional: false,
                      label: field.name,
                    });
                    // TODO support dict
                    break;
                  case "simple":
                    switch (field.type.type) {
                      // TODO
                      case "string":
                        result.push({
                          type: "string",
                          optional: field.type.optional || false,
                          label: field.name
                        });
                        break;
                      case "uint":
                        if (field.type.format == "coins") {
                          result.push({
                            type: "uint",
                            format: "coins",
                            optional: field.type.optional || false,
                            label: field.name
                          });
                        }
                        else if (typeof field.type.format == 'number') {
                          result.push({
                            type: "uint",
                            format: field.type.format,
                            optional: field.type.optional || false,
                            label: field.name
                          });
                        }
                        else {
                          result.push({
                            type: "unknown",
                            expected: "uint with" + field.type.format,
                            optional: false,
                            label: field.name,
                          });
                        }
                        break;
                      case "slice":
                        result.push({
                          type: "slice",
                          optional: false,
                          label: field.name,
                        })
                        break;
                      case "address":
                        result.push({
                          type: "address",
                          optional: false,
                          label: field.name,
                        })
                        break;
                      case "bool":
                        result.push({
                          type: "bool",
                          optional: true,
                          label: field.name,
                        })
                        break;
                      default:
                        result.push({
                          type: "unknown",
                          expected: field.type.type,
                          optional: false,
                          label: field.name,
                        });
                        break;
                    }
                    // TODO
                    break;
                }
              }
            }
        }
      }

      return result;
    }
  },
  methods: {
    setGetter(getter: ABIGetter) {
      this.getterResult = [];
      this.abi = { type: "getter", getter }
    },
    setReceiver(receiver: ABIReceiver) {
      this.getterResult = [];
      this.abi = { type: "receiver", receiver }
    },
    async computeGetter() {
      this.getterResult = [];

      if (this.abi.type !== "getter") {
        return;
      }

      this.refItems = this.refItems.filter(item => !!item);
      if (this.refItems.map((item) => item.validate()).filter(item => !item).length > 0) {
        return false;
      }

      const args = [] as TupleItem[];
      for (const input of this.refItems) {
        args.push({
          type: "slice",
          cell: beginCell().store(input.store).endCell()
        })
        // TODO
      }

      const provider = await this.provider.get(this.abi.getter.name, args);
      const providerLength = provider.stack.remaining;

      this.getterResult = [];
      for (let i = 0; i < providerLength; i++) {
        const item = provider.stack.pop();
        switch (item.type) {
          case "int":
            this.getterResult.push({
              type: item.type,
              value: item.value.toString()
            });
            break;
          case "cell":
          case "slice":
          case "builder":
            this.getterResult.push({
              type: item.type,
              value: item.cell.toBoc().toString("base64"),
            });
            break;
          default:
            this.getterResult.push({
              type: item.type,
              value: "No value",
            });
            break
        }
      }
    },
    async sendTransaction() {
      if (this.abi.type !== "receiver" || this.abi.receiver.message.kind !== "typed") {
        return;
      }

      this.refItems = this.refItems.filter(item => !!item);
      if (this.refItems.map((item) => item.validate()).filter(item => !item).length > 0) {
        return false;
      }

      const typeName = this.abi.receiver.message.type;
      const type = this.types.find((value) => value.name === typeName);
      if (!type) {
        return;
      }

      const tx = beginCell();

      if (type.header) {
        tx.storeUint(type.header, 32);
      }

      for (const input of this.refItems) {
        tx.store(input.store);
      }

      await this.$tonConnectUI.sendTransaction(
        {
          validUntil: Math.floor(Date.now() / 1000) + 360,
          messages: [
            {
              address: this.$route.params.address as string,
              amount: toNano("0.1").toString(),
              payload: tx.endCell().toBoc().toString("base64"),
            }
          ]
        }
      )
    }
  }
}
</script>