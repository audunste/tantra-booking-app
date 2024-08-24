// src/components/booking/BookingCreator.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '../ErrorMessage';

const BookingCreatorWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0px;
  background-color: inherit;
  border-radius: 8px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin: 0px 3px;
  gap: ${(props) => props.theme.dimens.gap}px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  font-size: 1.1em;
  padding: 2px;
  margin-top: 12px;

  &:hover {
    color: ${(props) => props.theme.colors.primaryHover};
  }

  &:focus {
    outline: none;
  }
`;

/*
                date={date}
                windows={windows}
                bookings={bookings}
                editing={booking}
                onCreate={({ startTime, endTime }) => {
                  setBookingBeingEdited(null);
                  editBooking(booking, startTime, endTime);
                }}
                onCancel={() => setBookingBeingEdited(null)}
                onDelete={(w) => {
                  setBookingBeingEdited(null);
                  deleteBooking(booking);
                }}
*/
const BookingCreator = ({ 
  date,
  windows,
  bookings,
  editing,
  onCreate,
  onCancel,
  onDelete,
}) => {
  const { t } = useTranslation();
  
  const [stage, setStage] = useState(0);  // Tracks the current stage
  const [massageType, setMassageType] = useState(null);  // Massage type selection
  const [addons, setAddons] = useState([]);  // Selected add-ons
  const [startTime, setStartTime] = useState('');  // Selected start time
  const [name, setName] = useState('');  // User's name
  const [email, setEmail] = useState('');  // User's email
  const [phone, setPhone] = useState('');  // Optional phone number
  const [comment, setComment] = useState('');  // Optional comment
  const [combinedError, setCombinedError] = useState('');

  const handleNext = () => {
    // Logic to move to the next stage
    setStage(stage + 1);
  };

  const handlePrevious = () => {
    // Logic to move to the previous stage
    setStage(stage - 1);
  };

  const handleSubmit = () => {
    // Final submission logic
    if (!name || !email || !startTime) {
      setCombinedError(t('missingFields_msg'));
      return;
    }



    onCreate({
      startTime,
      endTime,
      massageType,
      addons,
      name,
      email,
      phone,
      comment,
    });

    reset();
  };

  const reset = () => {
    setStage(0);
    setMassageType(null);
    setAddons([]);
    setStartTime('');
    setName('');
    setEmail('');
    setPhone('');
    setComment('');
    setCombinedError('');
  };

  return (
    <BookingCreatorWrapper>
      {stage === 0 && (
        <MassageTypeStage
          selectedType={massageType}
          onSelect={setMassageType}
          onNext={handleNext}
        />
      )}
      {stage === 1 && (
        <AddonsStage
          selectedAddons={addons}
          onSelect={setAddons}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
      {stage === 2 && (
        <TimeSlotStage
          startTime={startTime}
          onSelect={setStartTime}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
      {stage === 3 && (
        <BookingDetailsStage
          name={name}
          email={email}
          phone={phone}
          comment={comment}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onCommentChange={setComment}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
        />
      )}
      {combinedError && (<ErrorMessage $show={true}>{combinedError}</ErrorMessage>)}
      <ButtonContainer>
        <IconButton onClick={onCancel}>
          <FiX />
        </IconButton>
        {stage === 3 && (
          <IconButton onClick={handleSubmit}>
            <FiCheck />
          </IconButton>
        )}
      </ButtonContainer>
    </BookingCreatorWrapper>
  );
};

export default BookingCreator;
