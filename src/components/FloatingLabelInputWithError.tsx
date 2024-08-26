import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import ErrorMessage from './ErrorMessage';
import { FiHelpCircle } from 'react-icons/fi';

// Styled components
const InputWrapper = styled.div`
  width: 100%;
  position: relative;
  margin: 8px 0 0 0;

  &:hover .hover-icon {
    opacity: 1;
  }
`;

interface StyledInputProps {
  $hasError: Boolean;
  $hasInfo: Boolean;
}

const StyledInput = styled.input<StyledInputProps>`
  -webkit-appearance: none; /* Remove default styling on iOS */
  -moz-appearance: none; /* Remove default styling on Firefox */
  appearance: none; /* Remove default styling */

  width: 100%;
  padding: 10px;
  padding-right: ${(props) => (props.$hasInfo ? 38 : 10)}px;
  font-size: 1em;
  border: 2px solid ${(props) =>
    props.$hasError 
    ? props.theme.colors.error
    : (props.readOnly
      ? props.theme.colors.readOnlyBorder
      : props.theme.colors.border)};
  border-radius: 8px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};

  &:not([readonly]):focus {
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

  &:not([readonly]):focus + label {
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

const HelpButton = styled.button<{ $hoverVisible: Boolean }>`
  position: absolute;
  right: 4px;
  top: 4px;
  padding: 8px;
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text};
  cursor: ${(props) => (props.$hoverVisible ? 'pointer' : 'default')};
  opacity: ${(props) => (props.$hoverVisible ? 0 : 1)};
  transition: opacity 0.15s ease;

  /* Ensures there's no extra height */
  line-height: 0;

  /* Align the button properly */
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: none;
  }

  &.hover-icon {
    opacity: ${(props) => (props.$hoverVisible ? 0 : 'initial')};
  }
`;

const FloatingLabelInputWithError = ({
  type = 'text',
  value,
  onChange = undefined,
  label,
  validate = undefined,
  forceValidate = false,
  isEditable = true,
  info = undefined,
  onInfoClick = () => {}, // Add a callback for info button click
}) => {
  const theme = useTheme();
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [error, setError] = useState('');
  const hasError = error && error.length > 0;
  const hasInfo = info && info.length > 0;
  const shouldHoverIcon = theme.capabilities.canHover && hasInfo;

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
    if (debouncedValue && isEditable) {
      const errorMessage = validate ? validate(debouncedValue) : '';
      setError(errorMessage);
    }
  }, [debouncedValue, validate, isEditable]);

  // Validate on blur
  const handleBlur = () => {
    if (!isEditable) {
      return;
    }
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
        readOnly={!isEditable}
        $hasInfo={hasInfo}
      />
      <Label>{label}</Label>
      {hasInfo && (
        <HelpButton
          className="hover-icon"
          $hoverVisible={shouldHoverIcon}
          onClick={onInfoClick} // Respond to onClick event
        >
          <FiHelpCircle size={18} />
        </HelpButton>
      )}
      <ErrorMessage height={18} $show={hasError}>{error}</ErrorMessage>
    </InputWrapper>
  );
};

export default FloatingLabelInputWithError;
