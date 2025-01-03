<template>
  <h2 class="subtitle">{{ title || $t("message.JettonManage.ChooseOperation") }}</h2>

  <div v-if="!abi.type">
    {{ $t("message.JettonManage.DefaultText") }}
  </div>

  <div class="field" v-for="(input, index) in inputs" v-bind:key="index">
    <label class="label">{{ input.label }}</label>
    <div class="control">
      <input v-bind="input.bind" v-model="input.model" class="input">
    </div>
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
import { Address, beginCell, toNano, type ABIGetter, type ABIReceiver, type ABIType, type ContractProvider, type TupleItem } from 'ton-core';

interface InputItem {
  label: string,
  type: string,
  format: string | number | boolean | null | undefined;
  bind: {
    type: string,
    placeholder: string
  },
  model: string,
}

export default {
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
      getterResult: [] as { type: string, value: string }[]
    }
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
    inputs() {
      const result = [] as InputItem[];

      if (this.abi.type == "getter" && this.abi.getter.arguments) {
        for (const argument of this.abi.getter.arguments) {
          switch (argument.type.kind) {
            case "dict":
              // TODO
              break;
            case "simple":
              result.push({
                label: argument.name,
                type: argument.type.type,
                format: argument.type.format,
                bind: {
                  type: "text",
                  placeholder: argument.type.type
                },
                model: ""
              });
              break;
          }
        }
      }

      if (this.abi.type == "receiver" && this.abi.receiver.message.kind == "typed") {
        const typeName = this.abi.receiver.message.type;
        const type = this.types.find((value) => value.name === typeName);
        if (type) {
          for (const field of type.fields) {
            switch (field.type.kind) {
              case "dict":
                // TODO
                break;
              case "simple":
                result.push({
                  label: field.name,
                  type: field.type.type,
                  format: field.type.format,
                  bind: {
                    type: "text",
                    placeholder: field.type.type
                  },
                  model: ""
                });
                break;
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

      const args = [] as TupleItem[];

      for (const input of this.inputs) {
        switch (input.type) {
          case "address":
            args.push({
              type: "slice",
              cell: beginCell().storeAddress(Address.parse(input.model)).asCell()
            });
            break;
          default:
            console.log("UNKNOWN TYPE", input.type); // TODO
        }
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

      const typeName = this.abi.receiver.message.type;
      const type = this.types.find((value) => value.name === typeName);
      if (!type) {
        return;
      }

      let tx = beginCell();

      if (type.header) {
        tx.storeUint(type.header, 32);
      }

      for (const input of this.inputs) {
        switch (input.type) {
          case "uint":
            tx.storeUint(parseInt(input.model), input.format as number);
            break;
          case "address":
            tx.storeRef(beginCell().storeAddress(Address.parse(input.model)).asCell());
            break;
          default:
            console.log("UNKNOWN TYPE", input.type); // TODO
        }
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
