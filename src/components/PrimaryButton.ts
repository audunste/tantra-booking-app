import React from 'react';
import styled from 'styled-components';

export interface PrimaryButtonProps {
  $fill?: boolean;
}

const PrimaryButton = styled.button<PrimaryButtonProps>`
  background: linear-gradient(to right,
    ${(props) => props.disabled ? props.theme.colors.disabled : props.theme.colors.gradientStart},
    ${(props) => props.disabled ? props.theme.colors.disabled : props.theme.colors.primary},
    ${(props) => props.disabled ? props.theme.colors.disabled : props.theme.colors.gradientEnd}
  );
  border: none;
  width: ${(props) => props.$fill ? '100%' : 'auto'};
  max-width: 400px;
  color: ${(props) => props.theme.colors.onPrimary};
  font-size: 1em;
  font-weight: 600; /* Semi-bold text */
  text-shadow: 0 1px 1px ${(props) => props.theme.colors.onPrimaryShadow};
  padding: 10px 20px;
  margin: 6px 0;
  border-radius: 50px; /* Pill-shaped button */
  cursor: pointer;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  transition: background 0.15s;

  &:hover {
    background: linear-gradient(to right,
    ${(props) => props.disabled ? props.theme.colors.disabled : props.theme.colors.gradientStartHover},
    ${(props) => props.disabled ? props.theme.colors.disabled : props.theme.colors.primaryHover},
    ${(props) => props.disabled ? props.theme.colors.disabled : props.theme.colors.gradientEndHover}
    );
  }

`;

export default PrimaryButton;
