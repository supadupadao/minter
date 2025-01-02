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

<script lang="ts">
import type { TonConnectUI } from '@tonconnect/ui';
import type { TonClient } from 'ton';
import NavbarBlock from './components/NavbarBlock.vue';
import FooterBlock from './components/FooterBlock.vue';

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $tonConnectUI: TonConnectUI,
    $tonClient: TonClient,
  }
}

export default {
  components: {
    NavbarBlock, FooterBlock
  }
}
</script>
