// src/components/TimeWindowsCalendarContainer.js

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TimeWindowsCalendar from './TimeWindowsCalendar';
import { useTheme } from 'styled-components';

const minWidth = 320;
const maxWidth = 502;

const Container = styled.div`
  display: grid;
  gap: ${(props) => props.theme.dimens.gap}px;
  grid-template-columns: repeat(auto-fit, minmax(${minWidth}px, ${maxWidth}px));
  width: 100%;
`;

const TimeWindowsCalendarContainer = ({ groupedData }) => {
  // Key: yearMonth ex "2024-12"
  // Value: object ex {
  //   timeWindows: [
  //     { startTime, endTime, ... }, ...
  //   ],
  //   bookings: [ {
  //     publicBooking: { },
  //     privateBooking: { }
  //   } ]
  // }

  const [calendars, setCalendars] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    // Map grouped time windows to calendar components
    const calendarComponents = Object.entries(groupedData)
    .sort(([a], [b]) => a.localeCompare(b)) // Sort the entries by the key
    .map(
      ([yearMonth, data], index) => (
        <TimeWindowsCalendar
          key={yearMonth}
          yearMonth={yearMonth}
          windows={data.timeWindows}
          bookings={data.bookings}
          index={index}
        />
      )
    );
    setCalendars(calendarComponents);
  }, [groupedData]);

  useEffect(() => {
    // Calculate the width of the container and determine the appropriate grid layout
    const handleResize = () => {
      const container = document.getElementById('calendar-container');
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateColumnWidth = () => {
    if (calendars.length <= 1) {
      return Math.min(containerWidth, maxWidth);
    } else if (calendars.length === 2) {
      let colw = Math.floor((containerWidth - theme.dimens.gap) / 2);
      if (colw < minWidth) {
        return Math.min(containerWidth, maxWidth);
      }
    }
    // More than 2 calendars, calculate width based on number of columns
    var columns = Math.min(calendars.length, 3);
    while (columns > 1) {
      let colw = Math.floor((containerWidth - (theme.dimens.gap * (columns - 1))) / columns);
      if (colw >= minWidth) {
        return Math.min(colw, maxWidth);
      }
      columns = columns - 1;
    }
    return Math.min(containerWidth, maxWidth);
  };

  const columnWidth = calculateColumnWidth();

  return (
    <Container
      id="calendar-container"
      style={{
        //gridTemplateColumns: `repeat(auto-fit, minmax(${columnWidth}px, ${maxWidth}px))`,
        gridTemplateColumns: `repeat(auto-fit, ${columnWidth}px)`,
      }}
    >
      {calendars}
    </Container>
  );
};

export default TimeWindowsCalendarContainer;
