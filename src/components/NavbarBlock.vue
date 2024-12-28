<script setup lang="ts">
import ConnectWallet from './ConnectWallet.vue';
import LocaleChoose from './LocaleChoose.vue';
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <p><i>SupaDupa</i><b>Minter</b></p>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <RouterLink to="/" class="navbar-item">
          {{ $t('message.Navbar.Home') }}
        </RouterLink>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            {{ $t('message.Navbar.More') }}
          </a>

          <div class="navbar-dropdown">
            <RouterLink to="/about" class="navbar-item">
              {{ $t('message.Navbar.About') }}
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
