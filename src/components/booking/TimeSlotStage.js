import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
`;

const TimeSlotStage = ({ startTime, windows, onSelect, onPrevious, onNext }) => {
  const generateTimeSlots = (windows) => {
    // Logic to generate time slots based on windows
    return ['10:00', '11:00', '12:00'];  // Example time slots
  };

  const timeSlots = generateTimeSlots(windows);

  return (
    <Wrapper>
      <h3>Select Time Slot</h3>
      {timeSlots.map((slot, index) => (
        <div key={index} onClick={() => onSelect(slot)}>
          {slot}
        </div>
      ))}
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onNext}>Next</button>
    </Wrapper>
  );
};

export default TimeSlotStage;
