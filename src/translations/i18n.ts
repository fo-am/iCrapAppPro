import i18n from "i18next";
// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector

i18n.init({
    fallbackLng: "en",
    // the translations
    // realworld load that via xhr or bundle those using webpack
    resources: {
        en: {
            common: {
                introduction: "Manage your muck with the Farm Crap App",
                "the-farm-crap-app-pro": "Farm Crap App Pro"
            }
        },
        de: {
            common: {
                title: "Willkommen"
            }
        }
    },
    // have a initial namespace
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: {
        escapeValue: false // not needed for react
    }
});
export default i18n;
