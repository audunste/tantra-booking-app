// src/components/FloatingLabelDatePickerWithError.js
import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import ErrorMessage from './ErrorMessage';

// Styled components
const DatePickerWrapper = styled.div`
  width: 100%;
  display: block;
  position: relative;
  margin: 10px 0 0 0;
`;

const StyledDateInput = styled.input`
  -webkit-appearance: none; /* Remove default styling on iOS */
  -moz-appearance: none; /* Remove default styling on Firefox */
  appearance: none; /* Remove default styling */

  width: 100%;
  height: 42px;
  padding: 8px 10px;
  font-size: 1em;
  border: 2px solid ${(props) =>
    props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 8px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};

  /* Improve consistency in text rendering */
  font-family: inherit;
  line-height: 1.5;

  &:focus {
    border-color: ${(props) =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
  }

  &:not(:placeholder-shown) + label,
  &:valid + label {
    top: -1px;
    font-size: 0.75em;
    color: ${(props) =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
    background-color: ${(props) => props.theme.colors.background};
    padding: 0 4px;
  }

  &:focus + label {
    top: -1px;
    font-size: 0.75em;
    color: ${(props) =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    background-color: ${(props) => props.theme.colors.background};
    padding: 0 4px;
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
  value,
  onChange,
  label,
  minDate,
  validate,
  forceValidate,
  errorDelegate,
}) => {
  const [focused, setFocused] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [error, setError] = useState('');
  const hasError = error && error.length > 0;

  const onError = (newError) => {
    if (errorDelegate) {
      errorDelegate(newError);
    }
    setError(newError);
  };

  // Debounce effect to update the debounced value
  useEffect(() => {
    if (!hasError && !forceValidate) {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, 3000);

      // Cleanup function to clear the timeout
      return () => {
        clearTimeout(handler);
      };
    } else {
      setDebouncedValue(value);
    }
  }, [value, hasError]);

  // Validate the debounced value
  useEffect(() => {
    if (debouncedValue) {
      const errorMessage = validate ? validate(debouncedValue) : '';
      onError(errorMessage);
    }
  }, [debouncedValue, validate]);

  // Validate on blur
  const handleBlur = () => {
    const errorMessage = validate ? validate(value) : '';
    onError(errorMessage);
    setFocused(false);
  };

  if (forceValidate) {
    const errorMessage = validate ? validate(value) : '';
    if (error !== errorMessage) {
      onError(errorMessage);
    }
  }

  return (
    <DatePickerWrapper>
      <StyledDateInput
        aria-label="Date"
        type="date"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        min={minDate ? minDate.toISOString().split('T')[0] : undefined}
        placeholder=" " // Ensures space for label animation
        $hasError={hasError}
        required
      />
      <Label $hasFocus={focused} $hasValue={!!value}>
        {label}
      </Label>
      {!errorDelegate && (<ErrorMessage height={18} $show={hasError}>
        {error}
      </ErrorMessage>)}
    </DatePickerWrapper>
  );
};

export default FloatingLabelDatePickerWithError;
