<template>
  <div v-for="(input, index) in inputs" v-bind:key="`${formTitle}_${index}`">
    <StringField v-if="input.type == 'string'" v-bind="input"
      :ref="el => registerElement(index, el as BaseFieldElement)" />
    <CoinsField v-else-if="input.type == 'uint' && input.format == 'coins'" v-bind="input"
      :ref="el => registerElement(index, el as BaseFieldElement)" />
    <UintField v-else-if="input.type == 'uint'" v-bind="input"
      :ref="el => registerElement(index, el as BaseFieldElement)" />
    <SliceField v-else-if="input.type == 'slice'" v-bind="input"
      :ref="el => registerElement(index, el as BaseFieldElement)" />
    <AddressField v-else-if="input.type == 'address'" v-bind="input"
      :ref="el => registerElement(index, el as BaseFieldElement)" />
    <BooleanField v-else-if="input.type == 'bool'" v-bind="input"
      :ref="el => registerElement(index, el as BaseFieldElement)" />
    <!-- <UnknownField v-else v-bind="input" :ref="el => registerElement(index, el as BaseFieldElement)" /> -->
  </div>
</template>

<script lang="ts">
import type { Builder } from 'ton-core';
import type { CreateComponentPublicInstanceWithMixins } from 'vue';
import type { InputItem } from '@/utils/devTools';
import StringField from './StringField.vue';
import CoinsField from './CoinsField.vue';
import UintField from './UintField.vue';
import SliceField from './SliceField.vue';
import AddressField from './AddressField.vue';
import BooleanField from './BooleanField.vue';
import UnknownField from './UnknownField.vue';

type BaseFieldElement = CreateComponentPublicInstanceWithMixins<{
  validate(): boolean,
  store(builder: Builder): void,
}>;

export default {
  components: { StringField, CoinsField, UintField, SliceField, AddressField, BooleanField, UnknownField },
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
  computed: {
    registerElement(index: number, el: BaseFieldElement) {
      //
    }
  },
  data() {
    return {
      fields: [] as BaseFieldElement[],
    }
  }
}
</script>