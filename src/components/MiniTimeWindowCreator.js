import React, { useState, useEffect } from 'react';
import FloatingLabelTimePickerWithError from './FloatingLabelTimePickerWithError';
import { FiX, FiCheck, FiTrash2 } from 'react-icons/fi'; // Importing icons
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ErrorMessage from './ErrorMessage';
import { timeRangeFromWindow } from '../util/timeWindowUtil';

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

const MessageWrapper = styled.div`
  flex: 1;
  background-color: inherit;
  display: flex;
  align-items: center;  /* Vertically center the content */
  justify-content: flex-start; /* Horizontally align content to the left */
  text-align: left; /* Ensure text is left-aligned */
  //padding-left: 8px; /* Optional: Add some padding to create space from the left edge */
  height: 42px;
  padding-top: 8px;
  padding-left: 8px;
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

const MiniTimeWindowCreator = ({ date = null, window = null, onCreate, onCancel, onDelete = undefined }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [forceValidate, setForceValidate] = useState(false);
  const [errors, setErrors] = useState({
    startTime: '',
    endTime: '',
  });
  const [combinedError, setCombinedError] = useState('');

  useEffect(() => {
    if (window) {
      setStartTime(isoStringToTime(window.startTime));
      setEndTime(isoStringToTime(window.endTime));
    }
  }, [window]);

  const isoStringToTime = (isoString) => {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

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

      const startDateTime = new Date(window == null ? date : window.startTime);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const endDateTime = new Date(startDateTime);
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

    const differenceInMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);

    if (differenceInMinutes < 90) {
      return t('timeWindowMinimum_msg');
    }

    return '';
  };

  const createInvalid = validateEndTime(endTime);

  return (
    <MiniTimeWindowCreatorWrapper>
      <FlexContainer>
        {confirmDelete ? (
          <MessageWrapper>
            {t('confirm-delete.msg', { timeWindow: timeRangeFromWindow(window) })}
          </MessageWrapper>
        ) : (
          <>
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
          </>
        )}
        <ButtonContainer>
          {(window && !confirmDelete) && (
            <IconButton onClick={(e) => {
              e.preventDefault()
              setConfirmDelete(true)
            }}>
              <FiTrash2 />
            </IconButton>
          )}
          <IconButton onClick={(e) => {
            e.preventDefault()
            if (confirmDelete) {
              setConfirmDelete(false)
            } else {
              onCancel(e)
            }
          }}>
            <FiX />
          </IconButton>
          <IconButton onClick={(e) => {
            e.preventDefault()
            if (confirmDelete) {
              onDelete(e)
            } else {
              if (createInvalid) {
                handleInvalidSubmit(e)
              } else {
                handleSubmit(e)
              }
            }
          }}>
            <FiCheck />
          </IconButton>
        </ButtonContainer>
      </FlexContainer>
      {combinedError && (<ErrorMessage $show={true}>{combinedError}</ErrorMessage>)}
    </MiniTimeWindowCreatorWrapper>
  );
};

export default MiniTimeWindowCreator;
