// src/components/CheckboxWithError.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import ErrorMessage from './ErrorMessage';

// Styled components
const CheckboxWrapper = styled.div`
  width: 100%;
  position: relative;
  margin: 10px 0;
`;

const CheckboxLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px; /* Space between checkbox and error message */
`;

const StyledCheckbox = styled.input`
  width: 18px;
  height: 18px;
  margin-right: 10px;
  accent-color: ${(props) =>
    props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
  outline: none;
  transition: border-color 0.2s;
`;

const Label = styled.label`
  font-size: 1em;
  color: ${(props) => props.theme.colors.text};
`;

const CheckboxWithError = ({
  checked,
  onChange,
  label,
  validate,
  forceValidate,
}) => {
  const theme = useTheme();
  const [debouncedChecked, setDebouncedChecked] = useState(checked);
  const [error, setError] = useState('');
  const hasError = error && error.length > 0;

  // Debounce effect to update the debounced value
  useEffect(() => {
    if (!hasError && !forceValidate) {
      const handler = setTimeout(() => {
        setDebouncedChecked(checked);
      }, 3000);

      // Cleanup function to clear the timeout
      return () => {
        clearTimeout(handler);
      };
    } else {
      setDebouncedChecked(checked);
    }
  }, [checked, hasError]);

  // Validate the debounced value
  useEffect(() => {
    if (debouncedChecked !== undefined) {
      const errorMessage = validate ? validate(debouncedChecked) : '';
      setError(errorMessage);
    }
  }, [debouncedChecked, validate]);

  // Validate on blur
  const handleBlur = () => {
    const errorMessage = validate ? validate(checked) : '';
    setError(errorMessage);
  };

  if (forceValidate) {
    const errorMessage = validate ? validate(checked) : '';
    if (error !== errorMessage) {
      setError(errorMessage);
    }
  }

  return (
    <CheckboxWrapper>
      <CheckboxLabelWrapper>
        <StyledCheckbox
          type="checkbox"
          checked={checked}
          onChange={onChange}
          $hasError={hasError}
          onBlur={handleBlur}
        />
        <Label>{label}</Label>
      </CheckboxLabelWrapper>
      <ErrorMessage height={18} $show={hasError}>
        {error}
      </ErrorMessage>
    </CheckboxWrapper>
  );

};

export default CheckboxWithError;
