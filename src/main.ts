import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n';
import i18nRU from "@/i18n/ru.json";
import i18nEN from "@/i18n/en.json";

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: i18nEN,
    ru: i18nRU,
  },
});

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')
