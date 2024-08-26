import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '../ErrorMessage';
import MassageTypeStage from './MassageTypeStage';
import AddonsStage from './AddonsStage';
import TimeSlotStage from './TimeSlotStage';
import BookingDetailsStage from './BookingDetailsStage';
import { Booking, CreateBookingData, TimeWindow } from '../../model/bookingTypes';

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

interface BookingCreatorProps {
  masseurId: string;
  date?: Date;
  windows: TimeWindow[];
  bookings: Booking[];
  editing?: Booking;
  onCreate: (data: CreateBookingData) => void;
  onCancel: () => void;
  onDelete?: (data: Booking) => void;
}

const BookingCreator: React.FC<BookingCreatorProps> = ({ 
  masseurId,
  date = undefined,
  windows,
  bookings,
  editing = undefined,
  onCreate,
  onCancel,
  onDelete = undefined,
}) => {
  const { t } = useTranslation();
  
  const [stage, setStage] = useState(0);  // Tracks the current stage
  const [massageTypeId, setMassageTypeId] = useState<string>(null);  // Massage type selection
  const [addonIds, setAddonIds] = useState([]);  // Selected add-ons
  const [startTime, setStartTime] = useState<Date>(null);  // Selected start time
  const [name, setName] = useState('');  // User's name
  const [email, setEmail] = useState('');  // User's email
  const [phone, setPhone] = useState('');  // Optional phone number
  const [comment, setComment] = useState('');  // Optional comment
  const [combinedError, setCombinedError] = useState('');

  // Initialize state from the editing parameter if provided
  useEffect(() => {
    if (editing) {
      setMassageTypeId(editing.privateBooking.massageTypeId || null);
      setAddonIds(editing.privateBooking.addonIds || []);
      setStartTime(editing.publicBooking.startTime.toDate() || null);
      setName(editing.privateBooking.name || '');
      setEmail(editing.privateBooking.email || '');
      setPhone(editing.privateBooking.phone || '');
      setComment(editing.privateBooking.comment || '');
    }
  }, [editing]);

  const calculateEndTime = (startTime: Date, duration: number) => {
    return new Date(startTime.getTime() + duration * 60 * 1000);
  };

  const handleNext = () => {
    setStage(stage + 1);
  };

  const handlePrevious = () => {
    setStage(stage - 1);
  };

  const handleSubmit = () => {
    if (!name || !email || !startTime) {
      setCombinedError(t('missingFields_msg'));
      return;
    }

    const endTime = calculateEndTime(startTime, 90);  // Default to 90 minutes

    onCreate({
      startTime,
      endTime,
      massageTypeId,
      addonIds,
      name,
      email,
      phone,
      comment,
    });

    reset();
  };

  const reset = () => {
    setStage(0);
    setMassageTypeId(null);
    setAddonIds([]);
    setStartTime(null);
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
          selectedType={massageTypeId}
          onSelect={setMassageTypeId}
          onNext={handleNext}
        />
      )}
      {stage === 1 && (
        <AddonsStage
          selectedAddons={addonIds}
          onSelect={setAddonIds}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
      {stage === 2 && (
        <TimeSlotStage
          startTime={startTime}
          windows={windows}
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
