import React from 'react';
import styled from 'styled-components';

const SecondaryButton = styled.button`
  background: ${(props) => props.theme.colors.secondary}; 
  //border: 2px solid ${(props) => props.theme.colors.primary};
  border: none; 
  width: ${(props) => props.$fill ? '100%' : 'auto'};
  max-width: 400px;
  color: ${(props) => props.theme.colors.text}; /* Default theme text color */
  font-size: 1em;
  font-weight: 600; /* Semi-bold text */
  padding: 10px 20px;
  margin: 6px 0;
  border-radius: 50px; /* Pill-shaped button */
  cursor: pointer;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  transition: background 0.15s, color 0.15s, border-color 0.15s, background-color 0.05s;

  &:hover {
    background: ${(props) => props.theme.colors.secondaryHover}; /* Light background on hover */
    color: ${(props) => props.theme.colors.text};
  }
`;

export default SecondaryButton;
