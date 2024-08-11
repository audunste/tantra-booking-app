// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';
import deTranslation from './locales/de/translation.json';
import nbTranslation from './locales/nb/translation.json';

// Supported languages in your app
const availableLanguages = ['en', 'nb', 'de', 'es'];

// Get the user's preferred language from the browser
const userLanguage = navigator.languages
  .map(lang => lang.split('-')[0]) // Extract language code only (e.g., "en" from "en-US")
  .find(lang => availableLanguages.includes(lang)) // Find the first supported language
  || 'en'; // Fallback to 'en' if no supported language is found

// i18n configuration
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      de: {
        translation: deTranslation,
      },
      nb: {
        translation: nbTranslation,
      },
      no: {
        translation: nbTranslation,
      },
      es: {
        translation: esTranslation,
      },
    },
    lng: userLanguage, // Default language
    fallbackLng: 'en', // Fallback language if the selected language is not available
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
  });

export default i18n;
