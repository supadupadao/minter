<template>
  <h2 class="subtitle">{{ title || $t("message.JettonManage.ChooseOperation") }}</h2>

  <div v-if="!abi.type">
    {{ $t("message.JettonManage.DefaultText") }}
  </div>

  <div class="field" v-for="(input, index) in inputs" v-bind:key="index">
    <label class="label">{{ input.label }}</label>
    <div class="control">
      <input v-bind="input.bind" class="input">
    </div>
  </div>


</template>

<script lang="ts">
import type { ABIGetter, ABIReceiver, ABIType } from 'ton-core';

interface InputItem {
  label: string,
  bind: {
    type: string,
    placeholder: string
  }
}

export default {
  props: {
    types: {
      type: Object as () => ABIType[],
      required: true,
    }
  },
  data() {
    return {
      abi: {} as { type: "receiver", receiver: ABIReceiver } | { type: "getter", getter: ABIGetter },
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
                bind: {
                  type: "text",
                  placeholder: argument.type.type
                }
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
                  bind: {
                    type: "text",
                    placeholder: field.type.type
                  }
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
      this.abi = { type: "getter", getter }
    },
    setReceiver(receiver: ABIReceiver) {
      this.abi = { type: "receiver", receiver }
    }
  }
}
</script>
