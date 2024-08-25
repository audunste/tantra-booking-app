import React, { useState } from 'react';
import styled from 'styled-components';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameDay,
  isToday,
  getWeek,
  isSameMonth,
} from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '../util/getDateFnsLocale';
import DayDetails from './DayDetails';
import { Booking, TimeWindow } from '../model/bookingTypes';

const CalendarWrapper = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.secondaryBackground};
  border-radius: 8px;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 8px;
  background-color: ${(props) => props.theme.colors.headerBackground};
  text-align: center;
  font-weight: bold;
`;

const DaysOfWeek = styled.div`
  display: grid;
  gap: 1px;
  padding: 2px 0px;
  grid-template-columns: 0.5fr repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  font-size: 0.75em;
  background-color: ${(props) => props.theme.colors.tertiaryBackground};
`;

interface DayProps {
  $isCurrentDay: boolean;
  $hasWindows: boolean;
  $isSameMonth: boolean;
}

const Day = styled.div<DayProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px 1px;
  border: 1px solid
    ${(props) =>
      props.$isCurrentDay
        ? props.$hasWindows
          ? props.theme.colors.onPrimary
          : props.theme.colors.text
        : 'transparent'};
  background-color: ${(props) =>
    props.$isSameMonth
      ? props.$hasWindows
        ? props.theme.colors.primary
        : props.theme.colors.background
      : props.theme.colors.background};
  color: ${(props) =>
    props.$isSameMonth
      ? props.$hasWindows
        ? props.theme.colors.onPrimary
        : props.theme.colors.text
      : props.theme.colors.disabled};
  font-size: 0.9em;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.$isSameMonth
        ? props.$hasWindows
          ? props.theme.colors.primaryHover
          : props.theme.colors.backgroundHover
        : props.theme.colors.background};
  }
`;

const WeekNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  background-color: ${(props) => props.theme.colors.tertiaryBackground};
  color: ${(props) => props.theme.colors.text};
  font-weight: bold;
  font-size: 0.65em;
`;

const DateGrid = styled.div`
  display: grid;
  gap: 1px;
  grid-template-columns: 0.5fr repeat(7, 1fr); /* Adjust the grid to include the week number column */
`;

const BackButton = styled.button`
  margin-bottom: 10px;
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  font-size: 1em;
`;

interface TimeWindowsCalendarProps {
  yearMonth: string;
  windows: TimeWindow[];
  bookings: Booking[];
}

const TimeWindowsCalendar: React.FC<TimeWindowsCalendarProps> = ({ yearMonth, windows, bookings }) => {
  const [selectedDay, setSelectedDay] = useState(null);

  const { t, i18n } = useTranslation();
  const [year, month] = yearMonth.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);

  const startDay = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const endDay = endOfMonth(date);
  const days = [];
  let day = startDay;

  while (days.length < 42) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks = days.reduce((acc, day) => {
    const weekNumber = getWeek(day, { weekStartsOn: 1 });
    if (!acc[weekNumber]) acc[weekNumber] = [];
    acc[weekNumber].push(day);
    return acc;
  }, {});

  const fnsLocale = getDateFnsLocale(i18n.language);


  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleBackClick = () => {
    setSelectedDay(null);
  };

  const selectedDayWindows = selectedDay
    ? windows.filter((window: TimeWindow) => isSameDay(window.startTime.toDate(), selectedDay))
    : undefined;

  const selectedDaybookings = selectedDay
    ? bookings.filter((b: Booking) => isSameDay(b.publicBooking.startTime.toDate(), selectedDay))
    : undefined

  return (
    <CalendarWrapper>
      {!selectedDay ? (
        <>
          <Header>
            {capitalizeFirstLetter(format(date, 'MMMM yyyy', { locale: fnsLocale }))}
          </Header>
          <DaysOfWeek>
            <div></div> {/* Empty cell for the top-left corner */}
            <div>{format(addDays(startDay, 0), 'EEE', { locale: fnsLocale })}</div>
            <div>{format(addDays(startDay, 1), 'EEE', { locale: fnsLocale })}</div>
            <div>{format(addDays(startDay, 2), 'EEE', { locale: fnsLocale })}</div>
            <div>{format(addDays(startDay, 3), 'EEE', { locale: fnsLocale })}</div>
            <div>{format(addDays(startDay, 4), 'EEE', { locale: fnsLocale })}</div>
            <div>{format(addDays(startDay, 5), 'EEE', { locale: fnsLocale })}</div>
            <div>{format(addDays(startDay, 6), 'EEE', { locale: fnsLocale })}</div>
          </DaysOfWeek>
          <DateGrid>
            {Object.keys(weeks).map((weekNumber) => (
              <React.Fragment key={weekNumber}>
                <WeekNumber>{weekNumber}</WeekNumber> {/* Week number cell */}
                {weeks[weekNumber].map((day, index) => (
                  <Day
                    key={index}
                    $isSameMonth={isSameMonth(date, day)}
                    $hasWindows={windows.some((window) => isSameDay(window.startTime.toDate(), day))}
                    $isCurrentDay={isToday(day)}
                    onClick={() => handleDayClick(day)}
                  >
                    {format(day, 'd')}
                    {windows.some((window) => isSameDay(window.startTime.toDate(), day)) ? ' ★' : ''}
                  </Day>
                ))}
              </React.Fragment>
            ))}
          </DateGrid>
        </>
      ) : (
        <DayDetails 
          date={selectedDay}
          onBack={handleBackClick}
          windows={selectedDayWindows}
          bookings={selectedDaybookings}
        />
      )}
    </CalendarWrapper>
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default TimeWindowsCalendar;
