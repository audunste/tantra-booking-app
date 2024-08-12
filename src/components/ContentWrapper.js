// src/components/ContentWrapper.js
import styled from 'styled-components';

const ContentWrapper = styled.div`
  max-width: 1040px;
  width: 100%;
  padding: 0 ${(props) => props.theme.dimens.sideMargin}px;
  margin: 0 auto; /* Centers the content */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.colors.text || 'purple'};
  align-items: left; /* Left aligns children horizontally */

`;

export default ContentWrapper;
