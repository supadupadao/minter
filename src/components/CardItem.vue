<template>
  <div class="content">
    <h2 class="subtitle">{{ emoji }} {{ title }}</h2>
    <p v-html="description"></p>
    <a v-if="linkUrl" :href="linkUrl" target="_blank">{{ linkText }}</a>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    emoji: String,
    title: String,
    description: String,
    linkText: String,
    linkUrl: String,
  }
}
</script>
