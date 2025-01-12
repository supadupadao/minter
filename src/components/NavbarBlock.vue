<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <p><i>SupaDupa</i><b>Minter</b></p>
      </a>

      <a role="button" class="navbar-burger" v-bind:class="{ 'is-active': isBurgerActive }" @click="toggleBurgerActive"
        data-target="navMenu" aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navMenu" class="navbar-menu" v-bind:class="{ 'is-active': isBurgerActive }">
      <div class="navbar-start">
        <RouterLink to="/" class="navbar-item">
          {{ $t('message.Navbar.Home') }}
        </RouterLink>

        <RouterLink to="/deploy/jetton" class="navbar-item">
          {{ $t('message.Navbar.DeployJetton') }}
        </RouterLink>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            {{ $t('message.Navbar.More') }}
          </a>

          <div class="navbar-dropdown">
            <a href="https://docs.supadupa.space/minter" class="navbar-item" target="_blank">
              {{ $t('message.Navbar.Docs') }}
            </a>

            <RouterLink to="/about" class="navbar-item">
              {{ $t('message.pageTitles.About') }}
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <LocaleChoose />

        <ConnectWallet />
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import ConnectWallet from './ConnectWallet.vue';
import LocaleChoose from './LocaleChoose.vue';

export default {
  components: {
    ConnectWallet, LocaleChoose,
  },
  data() {
    return {
      isBurgerActive: false
    }
  },
  methods: {
    toggleBurgerActive() {
      this.isBurgerActive = !this.isBurgerActive;
    }
  }
}
</script>
