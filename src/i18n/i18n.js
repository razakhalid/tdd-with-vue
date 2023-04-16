import { createI18n } from "vue-i18n";
import en from './en.js';
import ol from './ol.js';

const i18n = createI18n({
    locale: 'en',
    messages: {
        en,
        ol
    }
});

export default i18n;