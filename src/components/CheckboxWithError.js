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

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.primary};
  }
`;

const Label = styled.label`
  font-size: 1em;
  color: ${(props) => props.theme.colors.text};

  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${(props) => props.theme.colors.secondary};
    }
  }
`;

const CheckboxWithError = ({
  checked,
  onChange,
  label,
  validate,
  forceValidate,
}) => {
  const [error, setError] = useState('');
  const hasError = error && error.length > 0;

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
          id="checkbox"
          aria-invalid={hasError}
          aria-describedby={hasError ? "error-message" : undefined}
        />
        <Label htmlFor="checkbox">{label}</Label>
      </CheckboxLabelWrapper>
      <ErrorMessage id="error-message" height={18} $show={hasError}>
        {error}
      </ErrorMessage>
    </CheckboxWrapper>
  );
};

export default CheckboxWithError;
