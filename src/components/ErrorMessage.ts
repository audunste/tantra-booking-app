import styled from 'styled-components';


interface ErrorMessageProps {
  height?: number;
  $show?: boolean;
  $marginTop?: number;
}

const ErrorMessage = styled.div<ErrorMessageProps>`
  height: ${(props) => (props.height ? `${props.height}px` : 'auto')}; 
  color: ${(props) => props.theme.colors.error};
  font-size: 0.8em;
  margin-top: ${(props) => (Number.isFinite(props.$marginTop) ? `${props.$marginTop}px` : '4px')};
  margin-left: 12px;
  text-align: left;
  transition: height 0.25s ease; /* Smooth transition when changing theme */
`;

export default ErrorMessage;