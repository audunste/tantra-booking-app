import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
`;

const MassageTypeStage = ({ selectedType, onSelect, onNext }) => {
  return (
    <Wrapper>
      <h3>Select Massage Type</h3>
      {/* Example of selection logic */}
      <div onClick={() => onSelect('Relaxation')}>Relaxation</div>
      <div onClick={() => onSelect('Deep Tissue')}>Deep Tissue</div>
      {/* Add more options as needed */}
      <button onClick={onNext}>Next</button>
    </Wrapper>
  );
};

export default MassageTypeStage;
