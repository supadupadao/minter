import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n';
import i18nRU from "@/i18n/ru.json";
import i18nEN from "@/i18n/en.json";
import { TonConnectUI } from '@tonconnect/ui';
import { TonClient } from 'ton';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: i18nEN,
    ru: i18nRU,
  },
});
const tonConnectUI = new TonConnectUI({
    manifestUrl: `${window.location.origin}/tonconnect-manifest.json`,
});
const tonClient = new TonClient({
  endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
});

const app = createApp(App)
app.config.globalProperties.$tonConnectUI = tonConnectUI;
app.config.globalProperties.$tonClient = tonClient;
app.use(router)
app.use(i18n)

app.mount('#app')
