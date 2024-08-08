// src/components/TimeWindowCreator.js
import React, { useState } from 'react';
import FloatingLabelDatePickerWithError from './FloatingLabelDatePickerWithError';
import FloatingLabelTimePickerWithError from './FloatingLabelTimePickerWithError';
import styled from 'styled-components';

const FlexContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const DatePickerWrapper = styled.div`
  flex: 2; /* The date picker will take up twice the space compared to each time picker */
`;

const TimePickerWrapper = styled.div`
  flex: 1; /* Each time picker will take up equal space */
`;

const TimeWindowCreator = ({ onCreate }) => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');

  const handleSubmit = () => {
    if (startTime && endTime) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const startDateTime = new Date(date);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const [endHours, endMinutes] = endTime.split(':').map(Number);
      const endDateTime = new Date(date);
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      onCreate({
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });
    } else {
      alert('Please select both start time and duration.');
    }
  };

  const validateEndTime = (endTime) => {
    if (!startTime || !endTime) return 'Start time and end time are required';
  
    // Convert the time strings (HH:mm) to Date objects
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
  
    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);
  
    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, 0, 0);
  
    // Calculate the difference in minutes
    const differenceInMinutes = (endDate - startDate) / (1000 * 60);
  
    // Check if the difference is less than 90 minutes
    if (differenceInMinutes < 90) {
      return 'End time must be at least 90 minutes after start time';
    }
  
    return '';
  };  

  return (
    <div>
      <h2>Create Time Window</h2>
      <FlexContainer>
        <DatePickerWrapper>
          <FloatingLabelDatePickerWithError
            selected={date}
            onChange={setDate}
            label="Date"
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            validate={undefined}
            forceValidate={undefined}
          />
        </DatePickerWrapper>
        <TimePickerWrapper>
          <FloatingLabelTimePickerWithError
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            label="Start Time"
            validate={undefined}
            forceValidate={undefined}
          />
        </TimePickerWrapper>
        <TimePickerWrapper>
          <FloatingLabelTimePickerWithError
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            label="End Time"
            validate={validateEndTime}
            forceValidate={undefined}
          />
        </TimePickerWrapper>
      </FlexContainer>
      <button onClick={handleSubmit}>Create Time Window</button>
    </div>
  );
};

export default TimeWindowCreator;
