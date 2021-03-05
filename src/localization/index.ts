import {createI18n} from "vue-i18n";
import enUS from "@/assets/languages/en-US.json";
import jaJP from "@/assets/languages/ja-JP.json";
import Locale from "@formatjs/intl-locale";

export function getBrowserLocale(): Locale {
    return navigator.languages !== undefined ?
        new Locale(navigator.languages[0]) :
        new Locale(navigator.language)
}

export default createI18n({
    locale: getBrowserLocale().baseName,
    fallbackLocale: 'en',
    messages: {
        "en": {...enUS},
        "ja": {...jaJP}
    }
})