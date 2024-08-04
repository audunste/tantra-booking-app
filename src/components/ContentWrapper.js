// src/components/ContentWrapper.js
import styled from 'styled-components';

const ContentWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  padding: 0 16px; /* 16px margin on smaller screens */
  margin: 0 auto; /* Centers the content */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.colors.text || 'purple'};
  align-items: left; /* Left aligns children horizontally */

  h1 {
    font-size: 1.8em;
    margin-top: 25px;
  }

`;

export default ContentWrapper;
