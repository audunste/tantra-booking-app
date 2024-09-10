import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import { FiHelpCircle } from 'react-icons/fi';
import Select from 'react-select';

// Styled components
const InputWrapper = styled.div`
  width: 100%;
  position: relative;
  margin: 8px 0 16px 0;

  &:hover .hover-icon {
    opacity: 1;
  }
`;

const Label = styled.label`
  position: absolute;
  top: -1px;
  left: 8px;
  font-size: 0.75em;
  color: ${(props) => props.theme.colors.borderText};
  background-color: ${(props) => props.theme.colors.background};
  padding: 0 4px;
  transform: translateY(-50%);
`;

const HelpButton = styled.button<{ $hoverVisible: Boolean }>`
  position: absolute;
  right: 44px;
  top: 3px;
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
    opacity: 1;
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

export interface Option {
  value: string;
  label: string;
}

interface FloatingLabelChoiceProps {
  label: string;
  value: Option | null;
  placeholder: string;
  options: Option[];
  onChange: (selectedOption: Option | null) => void;
  info?: string;
  isEditable?: boolean;
}

const FloatingLabelChoice: React.FC<FloatingLabelChoiceProps> = ({
  label,
  placeholder,
  value,
  options,
  onChange,
  info = '',
  isEditable = true,
}) => {
  const theme = useTheme();
  const [showPopover, setShowPopover] = useState(false);
  const buttonRef = useRef(null);
  const hasInfo = info && info.length > 0;
  const shouldHoverIcon = theme.capabilities.canHover && hasInfo;

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

  // Custom styles for react-select based on the theme
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: theme.colors.background,
      border: `2px solid ${theme.colors.border}`,
      //borderColor: theme.colors.border,
      borderRadius: '8px',
      padding: '0',
      boxShadow: 'none',
      '&:hover': {
        borderColor: theme.colors.border,
      },
      '&:focus': {
        borderColor: theme.colors.primary,
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? theme.colors.primary
        : theme.colors.background,
      color: theme.colors.text,
      '&:hover': {
        backgroundColor: theme.colors.primaryHover,
        color: theme.colors.background,
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme.colors.background,
      borderRadius: '8px',
      border: `1px solid ${theme.colors.border}`,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme.colors.text,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: theme.colors.text,
      '&:hover': {
        color: theme.colors.primary,
      },
    }),
  };
  
  return (
    <InputWrapper>
      <Select
        value={value}
        options={options}
        onChange={onChange}
        isDisabled={!isEditable}
        styles={customStyles}
        placeholder={placeholder}
      />
      <Label>{label}</Label>
      {hasInfo && (
        <>
          <HelpButton
            ref={buttonRef}
            type="button"
            className="hover-icon"
            $hoverVisible={shouldHoverIcon}
            onClick={() => setShowPopover(!showPopover)} // Toggle the popover
          >
            <FiHelpCircle size={18} />
          </HelpButton>
          {showPopover && <Popover>{info}</Popover>}
        </>
      )}
    </InputWrapper>
  );
  };
  
  export default FloatingLabelChoice;
  