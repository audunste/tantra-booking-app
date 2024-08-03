import React from 'react';
import styled from 'styled-components';


// Styled-component with conditional height
const ErrorMessage = styled.div`
  height: ${(props) => (props.height ? `${props.height}px` : 'auto')}; 
  color: ${(props) => props.theme.colors.error};
  font-size: 0.8em;
  margin-top: 4px;
  margin-left: 12px;
  visibility: ${(props) => (props.$show ? 'visible' : 'hidden')};
  text-align: left;
`;

export default ErrorMessage;