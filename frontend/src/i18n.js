import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files
import translationEN from './i18n/en/translation.json';
import translationUK from './i18n/uk/translation.json';

// Set up i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEN,
    },
    uk: {
      translation: translationUK,
    },
  },
  lng: 'en', // Set the default language to English
  fallbackLng: 'en', // Set English as the fallback language
  interpolation: {
    escapeValue: false, // React already escapes the values, so no need for additional escaping
  },
});

export default i18n;
