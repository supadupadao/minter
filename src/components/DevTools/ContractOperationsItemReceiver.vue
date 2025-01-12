<template>
  <!-- Receiver -->
  <a class="m-1">
    <span v-if="receiver.receiver == 'internal'" class="icon has-text-danger is-medium">
      <i class="fa-solid fa-circle"></i>
    </span>
    <span v-if="receiver.receiver == 'external'" class="icon has-text-warning is-medium">
      <i class="fa-solid fa-circle-half-stroke"></i>
    </span>
    <span v-if="receiver.message.kind == 'typed'">{{ receiver.message.type }}</span>
    <!-- <span v-if="receiver.message.kind == 'text'">{{ receiver.message.text }}</span> -->
    <!-- <span v-if="receiver.message.kind == 'empty'"><i>Empty</i></span> -->
    <!-- <span v-if="receiver.message.kind == 'any'"><i>Any message</i></span> -->
  </a>
</template>

<script lang="ts">
import type { ABIReceiver } from 'ton-core';

export default {
  props: {
    receiver: {
      type: Object as () => ABIReceiver,
      required: true,
    },
  },
};
</script>
