// src/utils/timeWindowUtil.ts

import i18n from 'i18next';
import { getDateFnsLocale } from './getDateFnsLocale';
import { format } from 'date-fns';
import { TimeWindow } from '../model/bookingTypes';


const timeRangeFromWindow = (window: TimeWindow) => {
  const fnsLocale = getDateFnsLocale(i18n.language);

  return format(window.startTime.toDate(), 'p', { locale: fnsLocale }) +
    ' - ' +
    format(window.endTime.toDate(), 'p', { locale: fnsLocale });
};

export { timeRangeFromWindow };