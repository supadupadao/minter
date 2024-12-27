<template>
  <div class="navbar-item has-dropdown is-hoverable">
    <a class="navbar-link">
      {{ $i18n.locale.toUpperCase() }}
    </a>

    <div class="navbar-dropdown">

      <a class="navbar-item" v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale"
        v-bind:class="{ 'is-selected': $i18n.locale.toUpperCase() === locale.toUpperCase() }"
        @click="$i18n.locale = locale.toLowerCase()">
        {{ locale.toUpperCase() }}
      </a>
    </div>
  </div>
</template>
