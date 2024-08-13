// src/utils/getDateFnsLocale.js

import { enGB, nb, de, es } from 'date-fns/locale';

/**
 * Get the corresponding date-fns locale based on the provided language code.
 *
 * @param {string} language - The language code (e.g., "en", "nb", "de", "es").
 * @returns {object} The date-fns locale object.
 */
export const getDateFnsLocale = (language) => {
  const localeMap = {
    en: enGB,  // British English (United Kingdom)
    nb: nb,    // Norwegian
    de: de,    // German
    es: es,    // Spanish
    // Add more mappings as needed
  };

  return localeMap[language] || enGB;  // Default to enGB if the language is not found
};
