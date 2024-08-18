// src/components/FloatingLabelTimePickerWithError.js
import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import ErrorMessage from './ErrorMessage';

// Styled components
const TimePickerWrapper = styled.div`
  width: 100%;
  position: relative;
  margin: 8px 0 0 0;
  background-color: inherit;
`;

const StyledTimeInput = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  width: 100%;
  height: 42px;
  padding: 8px 10px 8px 10px;
  font-size: 1em;
  border: 2px solid ${(props) =>
    props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 8px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
  background-color: inherit;
  color: ${(props) => props.theme.colors.text};
  
  /* Improve consistency in text rendering */
  font-family: inherit;
  line-height: 1.5;
  
  /* Override any default iOS shadow */
  box-shadow: none;

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
    background-color: inherit;
    padding: 0 4px;
  }

  &:focus + label {
    top: -1px;
    font-size: 0.75em;
    color: ${(props) =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    background-color: inherit;
    padding: 0 4px;
  }
`;

const Label = styled.label`
  position: absolute;
  top: ${(props) => (props.$hasFocus || props.$hasValue ? '-1px' : '20px')};
  left: 10px;
  font-size: ${(props) => (props.$hasFocus || props.$hasValue ? '0.75em' : '1em')};
  color: ${(props) => (props.$hasFocus
    ? props.theme.colors.primary
    : (props.$hasValue
      ? props.theme.colors.border
      : props.theme.colors.secondaryText))};
  background-color: inherit;
  transition: all 0.2s;
  pointer-events: none;
  padding: 0 4px; /* Adds padding to avoid text clipping */
  transform: translateY(-50%); /* Center text vertically */
`;

const FloatingLabelTimePickerWithError = ({
  value,
  onChange,
  label,
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
    <TimePickerWrapper>
      <StyledTimeInput
        aria-label="Time"
        type="time"
        step="300"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
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
    </TimePickerWrapper>
  );
};

export default FloatingLabelTimePickerWithError;
