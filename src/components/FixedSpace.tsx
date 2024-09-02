import React from 'react';
import styled from 'styled-components';

interface FixedSpaceProps {
  width?: number;
  height?: number;
}

const FixedSpace = styled.div<FixedSpaceProps>`
  width: ${(props) => props.width || 1}px;
  height: ${(props) => props.height || 1}px;
`;

export default FixedSpace;
