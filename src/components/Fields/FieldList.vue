<template>
  <div v-for="(input, index) in inputs" v-bind:key="`${formTitle}_${index}`">
    <StringField
      v-if="input.type == 'string'"
      v-bind="input"
      :ref="(el) => registerElement(index, el as BaseFieldElement)"
    />
    <CoinsField
      v-else-if="input.type == 'uint' && input.format == 'coins'"
      v-bind="input"
      :ref="(el) => registerElement(index, el as BaseFieldElement)"
    />
    <UintField
      v-else-if="input.type == 'uint'"
      v-bind="input"
      :ref="(el) => registerElement(index, el as BaseFieldElement)"
    />
    <IntField
      v-else-if="input.type == 'int'"
      v-bind="input"
      :ref="(el) => registerElement(index, el as BaseFieldElement)"
    />
    <CellField
      v-else-if="input.type == 'cell'"
      v-bind="input"
      :ref="(el) => registerElement(index, el as BaseFieldElement)"
    />
    <SliceField
      v-else-if="input.type == 'slice'"
      v-bind="input"
      :ref="(el) => registerElement(index, el as BaseFieldElement)"
    />
    <AddressField
      v-else-if="input.type == 'address'"
      v-bind="input"
      :ref="(el) => registerElement(index, el as BaseFieldElement)"
    />
    <BooleanField
      v-else-if="input.type == 'bool'"
      v-bind="input"
      :ref="(el) => registerElement(index, el as BaseFieldElement)"
    />
    <UnknownField
      v-else-if="input.type == 'any'"
      v-bind="input"
      label="Any field TODO"
      expected="any"
      :ref="(el) => registerElement(index, el as BaseFieldElement)"
    />
    <UnknownField
      v-else-if="input.type == 'empty'"
      v-bind="input"
      label="Empty field TODO"
      expected="empty"
      :ref="(el) => registerElement(index, el as BaseFieldElement)"
    />
    <UnknownField
      v-else-if="input.type == 'text'"
      v-bind="input"
      label="Text field TODO"
      expected="text"
      :ref="(el) => registerElement(index, el as BaseFieldElement)"
    />
    <UnknownField
      v-else
      v-bind="input"
      :ref="(el) => registerElement(index, el as BaseFieldElement)"
    />
  </div>
</template>

<script lang="ts">
import type { Builder } from 'ton-core';
import type { CreateComponentPublicInstanceWithMixins } from 'vue';
import StringField from './StringField.vue';
import CoinsField from './CoinsField.vue';
import UintField from './UintField.vue';
import SliceField from './SliceField.vue';
import AddressField from './AddressField.vue';
import BooleanField from './BooleanField.vue';
import type { InputItem } from '@/devTools/fields';
import UnknownField from './UnknownField.vue';
import CellField from './CellField.vue';
import IntField from './IntField.vue';

export type BaseFieldElement = CreateComponentPublicInstanceWithMixins<{
  validate(): boolean;
  store(builder: Builder): void;
}>;

export default {
  components: {
    StringField,
    CoinsField,
    UintField,
    IntField,
    CellField,
    SliceField,
    AddressField,
    BooleanField,
    UnknownField,
  },
  props: {
    formTitle: {
      type: String,
      required: true,
    },
    inputs: {
      type: Object as () => InputItem[],
      required: true,
    },
  },
  data() {
    return {
      fields: {} as { [id: number]: BaseFieldElement },
    };
  },
  methods: {
    registerElement(index: number, element: BaseFieldElement) {
      this.fields[index] = element;
    },
    getElements(): BaseFieldElement[] {
      return Object.values(this.fields).filter((item) => !!item);
    },
  },
  beforeUpdate() {
    this.fields = {};
  },
};
</script>
