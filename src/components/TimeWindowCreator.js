import React, { useState } from 'react';
import FloatingLabelDatePickerWithError from './FloatingLabelDatePickerWithError';
import FloatingLabelTimePickerWithError from './FloatingLabelTimePickerWithError';
import PrimaryButton from './PrimaryButton';
import styled from 'styled-components';
import SecondaryButton from './SecondaryButton';
import { useTranslation } from 'react-i18next';
import ErrorMessage from './ErrorMessage';

const TimeWindowCreatorWrapper = styled.div`
  width: calc(100% + 20px);
  box-sizing: border-box;
  position: relative;
  margin: 0 -10px;
  padding: 5px 10px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 16px;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.dimens.gap}px;
`;

const DatePickerWrapper = styled.div`
  flex: 2;
`;

const TimePickerWrapper = styled.div`
  flex: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${(props) => props.theme.dimens.gap}px;
  margin-top: 0px;
`;

const tomorrow = () => {
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

const TimeWindowCreator = ({ onCreate }) => {
  const [isExpanded, setExpanded] = useState(false);
  const [date, setDate] = useState(tomorrow());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [forceValidate, setForceValidate] = useState(false);
  const [errors, setErrors] = useState({
    date: '',
    startTime: '',
    endTime: '',
  });
  const [combinedError, setCombinedError] = useState('');

  const { t } = useTranslation();

  const reset = () => {
    setDate(tomorrow());
    setStartTime('10:00');
    setEndTime('14:00');
    setForceValidate(false);
    setErrors({
      date: '',
      startTime: '',
      endTime: '',
    });
    setCombinedError('');
  };

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
      setExpanded(false);
      reset();
    } else {
      console.log("Missing startTime or endTime")
    }
  };

  const handleInvalidSubmit = (e) => {
    e.preventDefault();
    setForceValidate(true);
  };

  const handleCreateNewAvailability = (e) => {
    e.preventDefault();
    setExpanded(true);
  }

  const handleCancel = () => {
    setExpanded(false);
    reset();
  }

  const handleError = (error, key) => {
    setErrors((prevErrors) => {
      // Check if the error for this key is different from the existing one
      if (prevErrors[key] !== error) {
        const newErrors = { ...prevErrors, [key]: error };
  
        // Find the first non-empty error in the updated error state
        const firstError = Object.values(newErrors).find((err) => err);
        
        // Update the combined error
        setCombinedError(firstError || '');
        
        // Return the new error state
        return newErrors;
      }
      
      // If the error hasn't changed, return the previous state without updating
      return prevErrors;
    });
  };  

  const validateDate = (date) => {
    if (!date) return t('dateRequired_msg'); // 'Date is required';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);

    if (selectedDate < today) {
      return t('dateNotInPast_msg'); // 'Date cannot be in the past';
    }

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);

    if (selectedDate > maxDate) {
      return t('dateNotTooFarFuture_msg'); // 'Date cannot be more than 6 months in the future';
    }

    return '';
  };

  const validateEndTime = (endTime) => {
    if (!startTime || !endTime) return t('startTimeAndEndTimeRequired_msg'); // 'Start time and end time are required';

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, 0, 0);

    const differenceInMinutes = (endDate - startDate) / (1000 * 60);

    if (differenceInMinutes < 90) {
      return t('timeWindowMinimum_msg'); // 'End time must be at least 90 minutes after start time';
    }

    return '';
  };

  const createInvalid =
    validateDate(date)
    || validateEndTime(endTime);

  return (
    <div>
      <TimeWindowCreatorWrapper>
        {!isExpanded && (
          <form onSubmit={handleCreateNewAvailability}>
              <PrimaryButton type="submit">{t('createNewAvailability_act')}</PrimaryButton>
          </form>
        )}
        {isExpanded && (
          <form onSubmit={createInvalid ? handleInvalidSubmit : handleSubmit}>
            <FlexContainer>
              <DatePickerWrapper>
                <FloatingLabelDatePickerWithError
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  label={t('date_lbl')}
                  minDate={new Date()}
                  validate={validateDate}
                  forceValidate={forceValidate}
                  errorDelegate={(error) => handleError(error, 'date')}
                />
              </DatePickerWrapper>
              <TimePickerWrapper>
                <FloatingLabelTimePickerWithError
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  label={t('startTime_lbl')}
                  validate={undefined}
                  forceValidate={forceValidate}
                  errorDelegate={(error) => handleError(error, 'startTime')}
                />
              </TimePickerWrapper>
              <TimePickerWrapper>
                <FloatingLabelTimePickerWithError
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  label={t('endTime_lbl')}
                  validate={validateEndTime}
                  forceValidate={undefined}
                  errorDelegate={(error) => handleError(error, 'endTime')}
                />
              </TimePickerWrapper>
            </FlexContainer>
            <ErrorMessage height={18} $show={true}>{combinedError}</ErrorMessage>
            <ButtonContainer>
              <SecondaryButton onClick={handleCancel}>{t('cancel_act')}</SecondaryButton>
              <PrimaryButton type="submit">{t('create_act')}</PrimaryButton>
            </ButtonContainer>
          </form>
        )}
      </TimeWindowCreatorWrapper>
    </div>
  );
};

export default TimeWindowCreator;
