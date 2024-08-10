// src/components/FloatingLabelInputWithError.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import ErrorMessage from './ErrorMessage';

// Styled components
const InputWrapper = styled.div`
  width: 100%;
  position: relative;
  margin: 10px 0 0 0;
`;

const StyledInput = styled.input`
  -webkit-appearance: none; /* Remove default styling on iOS */
  -moz-appearance: none; /* Remove default styling on Firefox */
  appearance: none; /* Remove default styling */

  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: 2px solid ${(props) =>
    props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 8px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};

  &:focus {
    border-color: ${(props) =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
  }

  &:not(:placeholder-shown) + label {
    top: -1px;
    font-size: 0.75em;
    color: ${(props) =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
    background-color: ${(props) => props.theme.colors.background};
    padding: 0 4px;
  }

  &:focus + label {
    /* Needed to get the color right in all situations */
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
  top: 20px;
  left: 10px;
  font-size: 1em;
  color: ${(props) => props.theme.colors.secondaryText};
  background-color: ${(props) => props.theme.colors.background};
  transition: all 0.2s;
  pointer-events: none;
  padding: 0 4px; /* Adds padding to avoid text clipping */
  transform: translateY(-50%); /* Center text vertically */
`;

const FloatingLabelInputWithError = ({
  type = 'text',
  value,
  onChange,
  label,
  validate,
  forceValidate
}) => {
  const theme = useTheme();
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [error, setError] = useState('');
  const hasError = error && error.length > 0;

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
      setError(errorMessage);
    }
  }, [debouncedValue, validate]);

  // Validate on blur
  const handleBlur = () => {
    const errorMessage = validate ? validate(value) : '';
    setError(errorMessage);
  };

  if (forceValidate) {
    const errorMessage = validate ? validate(value) : '';
    if (error != errorMessage) {
      setError(errorMessage);
    }
  }

  return (
    <InputWrapper>
      <StyledInput
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" " // Ensures space for label animation
        $hasError={hasError}
        onBlur={handleBlur}
      />
      <Label>{label}</Label>
      <ErrorMessage height={18} $show={hasError}>{error}</ErrorMessage>
    </InputWrapper>
  );
};

export default FloatingLabelInputWithError;
