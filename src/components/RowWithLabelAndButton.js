import React from 'react';
import styled from 'styled-components';
import { useTheme } from 'styled-components';

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 0px;
  box-sizing: border-box;
  position: relative;

  &:hover .hover-button {
    opacity: ${(props) => (props.$hoverVisible ? 1 : 'initial')};
  }
`;

const Label = styled.div`
  flex-grow: 1;
  padding-left: ${(props) => props.$indentation || '0px'};
  text-align: left;
  font-size: 1em;
  color: ${(props) => props.theme.colors.text};
`;

const ButtonFiller = styled.div`
  width: 30px;
  height: 30px;
`

const Button = styled.button`
  background: ${(props) => (props.$borderless ? 'transparent' : props.theme.colors.primary)};
  color: ${(props) => (props.$borderless ? props.theme.colors.primary : props.theme.colors.onPrimary)};
  border: ${(props) => (props.$borderless ? '1px solid transparent' : `1px solid ${props.theme.colors.primary}`)};
  padding: 5px 5px;
  border-radius: 20px;
  cursor: pointer;
  opacity: ${(props) => (props.$hoverVisible ? 0 : 1)};
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1; /* Ensures button is fully visible when hovered */
  }

  &:focus {
    outline: none;
  }

  &.hover-button {
    opacity: ${(props) => (props.$hoverVisible ? 0 : 'initial')};
  }
`;

const RowWithLabelAndButton = ({
  label,
  indentation = '0px',
  buttonContent,
  onButtonClick,
  hoverButton = false,
  borderlessButton = false, // New prop for borderless button
}) => {
  const theme = useTheme();
  const shouldHoverButton = hoverButton && theme.capabilities.canHover;

  return (
    <RowWrapper $hoverVisible={shouldHoverButton}>
      <Label $indentation={indentation}>{label}</Label>
      {buttonContent ? (
        <Button
          onClick={onButtonClick}
          className={shouldHoverButton ? 'hover-button' : ''}
          $hoverVisible={shouldHoverButton}
          $borderless={borderlessButton} // Pass borderlessButton prop to styled component
        >
          {buttonContent}
        </Button>
      ) : (
        <ButtonFiller />
      )}
    </RowWrapper>
  );
};

export default RowWithLabelAndButton;
