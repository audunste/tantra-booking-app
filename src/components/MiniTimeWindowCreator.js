import React, { useState } from 'react';
import FloatingLabelTimePickerWithError from './FloatingLabelTimePickerWithError';
import { FiX, FiCheck } from 'react-icons/fi'; // Importing icons
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ErrorMessage from './ErrorMessage';

const MiniTimeWindowCreatorWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0px;
  background-color: inherit;
  border-radius: 8px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const FlexContainer = styled.div`
  display: flex;
  background-color: inherit;
  gap: ${(props) => props.theme.dimens.gap}px;
  flex-grow: 1; /* Ensures the inputs take up the full width */
  width: 100%;
`;

const TimePickerWrapper = styled.div`
  flex: 1;
  background-color: inherit;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin: 0px 3px;
  gap: ${(props) => props.theme.dimens.gap}px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  font-size: 1.1em;
  padding: 2px;
  margin-top: 12px;
  
  &:hover {
    color: ${(props) => props.theme.colors.primaryHover};
  }

  &:focus {
    outline: none;
  }
`;

const MiniTimeWindowCreator = ({ onCreate, onCancel }) => {
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [forceValidate, setForceValidate] = useState(false);
  const [errors, setErrors] = useState({
    startTime: '',
    endTime: '',
  });
  const [combinedError, setCombinedError] = useState('');

  const { t } = useTranslation();

  const reset = () => {
    setStartTime('10:00');
    setEndTime('14:00');
    setForceValidate(false);
    setErrors({
      startTime: '',
      endTime: '',
    });
    setCombinedError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (startTime && endTime) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);

      const startDateTime = new Date();
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const endDateTime = new Date();
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      onCreate({
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });
      reset();
    } else {
      console.log("Missing startTime or endTime");
    }
  };

  const handleInvalidSubmit = (e) => {
    e.preventDefault();
    setForceValidate(true);
  };

  const handleError = (error, key) => {
    setErrors((prevErrors) => {
      if (prevErrors[key] !== error) {
        const newErrors = { ...prevErrors, [key]: error };
        const firstError = Object.values(newErrors).find((err) => err);
        setCombinedError(firstError || '');
        return newErrors;
      }
      return prevErrors;
    });
  };

  const validateEndTime = (endTime) => {
    if (!startTime || !endTime) return t('startTimeAndEndTimeRequired_msg');

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, 0, 0);

    const differenceInMinutes = (endDate - startDate) / (1000 * 60);

    if (differenceInMinutes < 90) {
      return t('timeWindowMinimum_msg');
    }

    return '';
  };

  const createInvalid = validateEndTime(endTime);

  return (
    <MiniTimeWindowCreatorWrapper>
      <FlexContainer>
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
            forceValidate={forceValidate}
            errorDelegate={(error) => handleError(error, 'endTime')}
          />
        </TimePickerWrapper>
        <ButtonContainer>
          <IconButton onClick={onCancel}>
            <FiX />
          </IconButton>
          <IconButton onClick={createInvalid ? handleInvalidSubmit : handleSubmit}>
            <FiCheck />
          </IconButton>
        </ButtonContainer>
      </FlexContainer>
      {combinedError && (<ErrorMessage $show={true}>{combinedError}</ErrorMessage>)}
    </MiniTimeWindowCreatorWrapper>
  );
};

export default MiniTimeWindowCreator;
