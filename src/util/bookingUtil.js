// src/utils/timeWindowUtil.js

import i18n from 'i18next';
import { getDateFnsLocale } from './getDateFnsLocale';
import { format } from 'date-fns';


const labelFromBooking = (booking) => {
  const publicBooking = booking.publicBooking;
  const privateBooking = booking.privateBooking;

  const fnsLocale = getDateFnsLocale(i18n.language);

  return format(new Date(publicBooking.startTime), 'p', { locale: fnsLocale }) +
    ' - ' + privateBooking.name;
};

export { labelFromBooking };