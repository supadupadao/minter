<template>
  <article class="message" :class="bulmaColor">
    <div class="message-body">
      <h1 class="title">{{ emoji }} {{ title }}</h1>
      <p>{{ description }}</p>
      <a v-if="linkUrl" :href="linkUrl" target="_blank">{{ linkText }}</a>
    </div>
  </article>
</template>

<script lang="ts">
export default {
  props: {
    emoji: String,
    title: String,
    description: String,
    linkText: String,
    linkUrl: String,
    bulmaColor: String,
  }
}
</script>
