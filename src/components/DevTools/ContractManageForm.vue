<template>
  <h2 class="subtitle">{{ title || $t('message.DevTools.ChooseOperation') }}</h2>

  <div v-if="!title">
    {{ $t('message.DevTools.DefaultText') }}
  </div>

  <FieldList ref="fieldList" :form-title="title ?? 'title'" :inputs="inputs" />

  <button
    v-if="title"
    class="button is-primary"
    @click="devTools.execute($refs.fieldList?.getElements() ?? [])"
  >
    Execute
  </button>

  <div v-if="devTools.result" class="content">
    <ul>
      <li v-for="(item, index) in devTools.result" v-bind:key="index">
        <b>{{ item.key }}</b
        >: {{ item.value }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  toNano,
  type ABIGetter,
  type ABIReceiver,
  type ABIType,
  type ContractProvider,
} from 'ton-core';
import FieldList from '../Fields/FieldList.vue';
import { BaseDevTools } from '@/devTools/base';
import { GetterDevTools } from '@/devTools/getter';
import { ReceiverDevTools } from '@/devTools/receiver';

export default {
  components: { FieldList },
  props: {
    types: {
      type: Object as () => ABIType[],
      required: true,
    },
    provider: {
      type: Object as () => ContractProvider,
      required: true,
    },
  },
  data() {
    return {
      devTools: new BaseDevTools(),
      getterResult: [] as { type: string; value: string }[],
    };
  },
  computed: {
    title() {
      return this.devTools.getTitle();
    },
    inputs() {
      return this.devTools.getFields();
    },
  },
  methods: {
    setGetter(getter: ABIGetter) {
      this.devTools = new GetterDevTools({
        getter,
        provider: this.provider,
      });
    },
    setReceiver(receiver: ABIReceiver) {
      this.devTools = new ReceiverDevTools({
        receiver,
        types: this.types,
        address: this.$route.params.address as string,
        tonConnectUI: this.$tonConnectUI,
        tonAmount: toNano('0.1'),
      });
    },
  },
};
</script>
