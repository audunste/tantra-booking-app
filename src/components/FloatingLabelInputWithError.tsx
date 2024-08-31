import React, { useState, useEffect, useRef } from 'react';
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
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

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
  padding: 0 4px;
  transform: translateY(-50%);
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

  line-height: 0;

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

const Popover = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  width: 250px;
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
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
}) => {
  const theme = useTheme();
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [error, setError] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const buttonRef = useRef(null);
  
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
    const errorMessage = validate ? validate(value || '') : '';
    setError(errorMessage);
  };

  if (forceValidate) {
    const errorMessage = validate ? validate(value || '') : '';
    if (error != errorMessage) {
      setError(errorMessage);
    }
  }

  // Handle outside click to close the popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && buttonRef.current.contains(event.target)) {
        return;
      }
      if (showPopover) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  return (
    <InputWrapper>
      <StyledInput
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        $hasError={hasError}
        onBlur={handleBlur}
        readOnly={!isEditable}
        $hasInfo={hasInfo}
      />
      <Label>{label}</Label>
      {hasInfo && (
        <>
          <HelpButton
            ref={buttonRef}
            type="button" // Prevents form submission
            className="hover-icon"
            $hoverVisible={shouldHoverIcon}
            onClick={() => setShowPopover(!showPopover)} // Toggle the popover
          >
            <FiHelpCircle size={18} />
          </HelpButton>
          {showPopover && <Popover>{info}</Popover>}
        </>
      )}
      <ErrorMessage height={18} $show={hasError}>
        {error}
      </ErrorMessage>
    </InputWrapper>
  );
};

export default FloatingLabelInputWithError;
