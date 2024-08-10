import React, { useState } from 'react';
import FloatingLabelDatePickerWithError from './FloatingLabelDatePickerWithError';
import FloatingLabelTimePickerWithError from './FloatingLabelTimePickerWithError';
import PrimaryButton from './PrimaryButton';
import styled, { ThemeProvider } from 'styled-components';
import SecondaryButton from './SecondaryButton'; // Assuming you have a SecondaryButton component
import { Heading2 } from './Heading';

const TimeWindowCreatorWrapper = styled.div`
  width: calc(100% + 20px);
  box-sizing: border-box;
  position: relative;
  margin: 0 -10px;
  padding: 5px 10px;
  background-color: ${(props => props.theme.colors.background)};
  //border: 2px solid ${(props) => props.theme.colors.border}; /* 2px border with primary color */
  border-radius: 16px;

`;

const FlexContainer = styled.div`
  display: flex;
  gap: ${(props => props.theme.dimens.gap)}px;
`;

const DatePickerWrapper = styled.div`
  flex: 2; /* The date picker will take up twice the space compared to each time picker */
`;

const TimePickerWrapper = styled.div`
  flex: 1; /* Each time picker will take up equal space */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${(props => props.theme.dimens.gap)}px;
  margin-top: 0px; /* Add space above the buttons */
`;

const tomorrow = () => {
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

const TimeWindowCreator = ({ onCreate, onCancel }) => { 
  const [date, setDate] = useState(tomorrow());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [forceValidate, setForceValidate] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const handleInvalidSubmit = (e) => {
    e.preventDefault()
    setForceValidate(true);
  };

  const validateDate = (date) => {
    if (!date) return 'Date is required';

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset today's time to midnight

    const selectedDate = new Date(date);
    
    if (selectedDate < today) {
      return 'Date cannot be in the past';
    }

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6); // Set the max date to 6 months from today

    if (selectedDate > maxDate) {
      return 'Date cannot be more than 6 months in the future';
    }

    return '';
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

  const createInvalid =
    validateDate(date)
    || validateEndTime(endTime);

  return (
    <div>
      <Heading2>Create Time Window</Heading2>
      <TimeWindowCreatorWrapper>
        <form onSubmit={createInvalid ? handleInvalidSubmit : handleSubmit}>
        <FlexContainer>
          <DatePickerWrapper>
            <FloatingLabelDatePickerWithError
              value={date}
              onChange={(e) => setDate(e.target.value)}
              label="Date"
              minDate={new Date()}
              validate={validateDate}
              forceValidate={forceValidate}
            />
          </DatePickerWrapper>
          <TimePickerWrapper>
            <FloatingLabelTimePickerWithError
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              label="Start Time"
              validate={undefined}
              forceValidate={forceValidate}
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
        <ButtonContainer>
          <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
          <PrimaryButton type="submit">
            Create
          </PrimaryButton>
        </ButtonContainer>
        </form>
      </TimeWindowCreatorWrapper>
    </div>
  );
};

export default TimeWindowCreator;
