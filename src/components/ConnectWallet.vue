<template>
  <div v-if="!isConnected.value" class="navbar-item">
    <div class="buttons">
      <a class="button is-primary" @click="openModal">
        <strong>{{ $t('message.Navbar.ConnectWallet') }}</strong>
      </a>
    </div>
  </div>
  <div v-else class="navbar-item has-dropdown is-hoverable">
    <a class="navbar-link button is-info">
      {{ isConnected.address }}
    </a>

    <div class="navbar-dropdown">
      <a class="navbar-item" @click="disconnect">{{ $t('message.Navbar.Disconnect') }}</a>
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
    },
    disconnect() {
      this.$tonConnectUI.disconnect();
      this.isConnected.value = false;
    }
  }
}
</script>
