// src/components/InputWithError.js
import React from 'react';
import styled from 'styled-components';
import { useTheme } from 'styled-components';

// Styled components
const InputWrapper = styled.div`
  width: 100%;
  margin: 10px 0;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid ${(props) => props.borderColor || 'gray'};
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1em;
  outline: none;

  &:focus {
    border-color: ${(props) => props.borderColor || '#ff8c00'};
  }
`;

const ErrorMessage = styled.div`
  height: 20px; /* Fixed height to maintain layout */
  color: ${(props) => props.theme.colors.error};
  font-size: 0.85em;
  margin-top: 5px;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  text-align: left;
`;

const InputWithError = ({ type, value, onChange, placeholder, borderColor, error }) => {
  const theme = useTheme();

  return (
    <InputWrapper>
      <StyledInput
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        borderColor={error ? theme.colors.error : borderColor}
      />
      <ErrorMessage show={!!error}>{error}</ErrorMessage>
    </InputWrapper>
  );
};

export default InputWithError;
