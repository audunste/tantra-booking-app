// src/utils/timeWindowUtil.js

import i18n from 'i18next';
import { getDateFnsLocale } from './getDateFnsLocale';
import { format } from 'date-fns';


const timeRangeFromWindow = (window) => {
  const fnsLocale = getDateFnsLocale(i18n.language);

  return format(new Date(window.startTime), 'p', { locale: fnsLocale }) +
    ' - ' +
    format(new Date(window.endTime), 'p', { locale: fnsLocale });
};

export { timeRangeFromWindow };