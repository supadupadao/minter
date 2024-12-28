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
    <div class="hero-body">
      <div class="section">
        <h1 class="title">{{ $t(`message.pageTitles.${$route.name!!.toString()}`) }}</h1>
        <RouterView />
      </div>
    </div>
    <div class="hero-foot">
      <FooterBlock />
    </div>
  </section>
</template>
