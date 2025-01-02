import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n';
import i18nRU from "@/i18n/ru.json";
import i18nEN from "@/i18n/en.json";
import { TonConnectUI } from '@tonconnect/ui';
import { TonClient } from 'ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';

const app = createApp(App);

(async () => {
  app.use(router)

  const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: i18nEN,
      ru: i18nRU,
    },
  });
  app.use(i18n);

  const tonConnectUI = new TonConnectUI({
      manifestUrl: `${window.location.origin}/tonconnect-manifest.json`,
  });

  app.config.globalProperties.$tonConnectUI = tonConnectUI;

  const endpoint = await getHttpEndpoint({
    network: "testnet",
  }); 
  const tonClient = new TonClient({
    endpoint,
  });

  app.config.globalProperties.$tonClient = tonClient;

  app.mount('#app')
})();
