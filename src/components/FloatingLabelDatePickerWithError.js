// src/components/FloatingLabelDatePickerWithError.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import styled, { useTheme } from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import ErrorMessage from './ErrorMessage';

import { enGB } from 'date-fns/locale'; // Example with en-GB

// Styled components
const DatePickerWrapper = styled.div`
  width: 100%;
  display: block;
  position: relative;
  margin: 10px 0 0 0;

  .react-datepicker-wrapper {
    display: block;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  height: 42px;
  padding: 10px;
  font-size: 1em;
  border: 2px solid ${(props) =>
    props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 8px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
  padding: 10px;

  &:focus {
    border-color: ${(props) =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
  }
`;

const Label = styled.label`
  position: absolute;
  top: ${(props) => (props.focused || props.$hasValue ? '-1px' : '20px')};
  left: 10px;
  font-size: ${(props) => (props.$hasFocus || props.$hasValue ? '0.75em' : '1em')};
  color: ${(props) => (props.$hasFocus
    ? props.theme.colors.primary
    : (props.$hasValue
      ? props.theme.colors.border
      : props.theme.colors.secondaryText))};
  background-color: ${(props) => props.theme.colors.background};
  transition: all 0.2s;
  pointer-events: none;
  padding: 0 4px; /* Adds padding to avoid text clipping */
  transform: translateY(-50%); /* Center text vertically */
`;

const FloatingLabelDatePickerWithError = ({
  selected,
  onChange,
  label,
  dateFormat,
  minDate,
  validate,
  forceValidate,
}) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(selected);
  const [error, setError] = useState('');
  const hasError = error && error.length > 0;

  // Format the date to include the day of the week
  const formatDateWithDay = (date) => {
    if (!date) return '';
    const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // Debounce effect to update the debounced value
  useEffect(() => {
    if (!hasError && !forceValidate) {
      const handler = setTimeout(() => {
        setDebouncedValue(selected);
      }, 3000);

      // Cleanup function to clear the timeout
      return () => {
        clearTimeout(handler);
      };
    } else {
      setDebouncedValue(selected);
    }
  }, [selected, hasError]);

  // Validate the debounced value
  useEffect(() => {
    if (debouncedValue) {
      const errorMessage = validate ? validate(debouncedValue) : '';
      setError(errorMessage);
    }
  }, [debouncedValue, validate]);

  // Validate on blur
  const handleBlur = () => {
    const errorMessage = validate ? validate(selected) : '';
    setError(errorMessage);
    setFocused(false);
  };

  if (forceValidate) {
    const errorMessage = validate ? validate(selected) : '';
    if (error !== errorMessage) {
      setError(errorMessage);
    }
  }

  return (
    <DatePickerWrapper>
      <StyledDatePicker
        selected={selected}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        placeholderText=" " // Ensures space for label animation
        dateFormat={dateFormat}
        locale={enGB}
        minDate={minDate}
        $hasError={hasError}
        customTimeInput={
          <input
            value={selected ? formatDateWithDay(selected) : ''}
            readOnly
            $hasError={hasError}
            onClick={() => setFocused(true)}
          />
        }
      />
      <Label $hasFocus={focused} $hasValue={!!selected}>
        {label}
      </Label>
      <ErrorMessage height={18} $show={hasError}>
        {error}
      </ErrorMessage>
    </DatePickerWrapper>
  );
};

export default FloatingLabelDatePickerWithError;
