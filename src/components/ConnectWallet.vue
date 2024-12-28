<template>
  <div class="navbar-item">
    <div class="buttons">
      <a v-if="!isConnected.value" class="button is-primary" @click="openModal">
        <strong>{{ $t('message.Navbar.ConnectWallet') }}</strong>
      </a>
      <a v-else class="button is-info" @click="openModal">
        <strong>{{ isConnected.address }}</strong>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import type { TonConnectUI } from '@tonconnect/ui';
import { reactive } from 'vue';

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $tonConnectUI: TonConnectUI,
  }
}


export default {
  setup() {
    return {
      isConnected: reactive({
        value: false,
        address: "",
      })
    }
  },
  beforeMount() {
    this.$tonConnectUI.onStatusChange(
      walletAndwalletInfo => {
        this.isConnected.value = true;
        this.isConnected.address = walletAndwalletInfo?.account.address.substring(0, 10) + "...";
      }
    );
  },
  methods: {
    openModal() {
      this.$tonConnectUI.openModal();
    }
  }
}
</script>
