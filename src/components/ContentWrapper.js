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
  align-items: left; /* Centers children horizontally */
`;

export default ContentWrapper;
