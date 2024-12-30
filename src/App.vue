<script setup lang="ts">
import NavbarBlock from "@/components/NavbarBlock.vue"
import FooterBlock from "@/components/FooterBlock.vue"
import { RouterView } from 'vue-router'
</script>

<template>
  <section class="hero is-fullheight">
    <div class="hero-head">
      <NavbarBlock />
    </div>
    <div class="hero-body p-0">
      <div class="container is-fluid p-3">
        <RouterView />
      </div>
    </div>
    <div class="hero-foot">
      <FooterBlock />
    </div>
  </section>
</template>
