<template>
  <!-- Receiver -->
  <a class="m-1">
    <span class="icon has-text-success is-medium">
      <i class="fa-regular fa-circle"></i>
    </span>
    <span>{{ getter.name }}</span>
  </a>
</template>

<script lang="ts">
import type { ABIGetter } from 'ton-core';

export default {
  props: {
    getter: {
      type: Object as () => ABIGetter,
      required: true,
    },
  },
};
</script>
