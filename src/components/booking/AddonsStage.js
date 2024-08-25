import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
`;

const AddonsStage = ({ selectedAddons, onSelect, onPrevious, onNext }) => {
  const toggleAddon = (addon) => {
    if (selectedAddons.includes(addon)) {
      onSelect(selectedAddons.filter((a) => a !== addon));
    } else {
      onSelect([...selectedAddons, addon]);
    }
  };

  return (
    <Wrapper>
      <h3>Select Add-ons</h3>
      {/* Example of selection logic */}
      <div onClick={() => toggleAddon('Hot Stones')}>Hot Stones</div>
      <div onClick={() => toggleAddon('Aromatherapy')}>Aromatherapy</div>
      {/* Add more options as needed */}
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onNext}>Next</button>
    </Wrapper>
  );
};

export default AddonsStage;
