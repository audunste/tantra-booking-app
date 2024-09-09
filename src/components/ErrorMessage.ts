import React from 'react';
import styled from 'styled-components';


interface ErrorMessageProps {
  height?: number;
  $show: boolean;
}

const ErrorMessage = styled.div<ErrorMessageProps>`
  height: ${(props) => (props.height ? `${props.height}px` : 'auto')}; 
  color: ${(props) => props.theme.colors.error};
  font-size: 0.8em;
  margin-top: 4px;
  margin-left: 12px;
  text-align: left;
  transition: height 0.25s ease; /* Smooth transition when changing theme */
`;
  //visibility: ${(props) => (props.$show ? 'visible' : 'hidden')};

export default ErrorMessage;