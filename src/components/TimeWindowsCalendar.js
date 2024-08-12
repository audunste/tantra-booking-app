// src/components/TimeWindowsCalendar.js

import React from 'react';
import styled from 'styled-components';

const CalendarContainer = styled.div`
  width: 100%;
  padding-top: 65%; /* This maintains the aspect ratio of 65% height relative to width */
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 8px; /* Optional: add some border radius for visual appeal */
  position: relative;
`;

const TimeWindowsCalendar = ({ monthYear, windows }) => {
  return (
    <CalendarContainer>
      {/* Future content for calendar will go here */}
    </CalendarContainer>
  );
};

export default TimeWindowsCalendar;
