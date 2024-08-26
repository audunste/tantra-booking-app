import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '../util/getDateFnsLocale';
import RowWithLabelAndButton from './RowWithLabelAndButton';
import { FiPlus, FiEdit } from 'react-icons/fi'; // Importing icons from react-icons
import MiniTimeWindowCreator from './MiniTimeWindowCreator';
import BookingCreator from './booking/BookingCreator';
import { useState } from 'react';
import { createTimeWindow, editTimeWindow, deleteTimeWindow, editBooking, createBooking, deleteBooking } from '../model/firestoreService';
import { timeRangeFromWindow } from '../util/timeWindowUtil';
import { labelFromBooking } from '../util/bookingUtil';
import { Booking, TimeWindow } from '../model/bookingTypes';
import { auth } from '../firebaseConfig';

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  background-color: ${(props) => props.theme.colors.headerBackground};
  font-weight: bold;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  font-size: 1.5em;
  padding: 0 4px;
`;

const Title = styled.div`
  flex-grow: 1;
  padding: 4px;
  text-align: center;
  color: ${(props) => props.theme.colors.text};
`;

const DayDetailsWrapper = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.secondaryBackground};
  border-radius: 8px;
  overflow: hidden;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px; /* Adjust the gap as needed for spacing between rows */
  padding: 8px; /* Add padding inside the container for inner spacing */
  background-color: ${(props) => props.theme.colors.secondaryBackground};
`;

const Spacer = styled.div`
  width: 1.5em; /* Keeps the title centered by taking up the same space as the back button */
`;

const DayDetailsHeader = ({ title, onBack }) => {
  return (
    <HeaderWrapper>
      <BackButton onClick={onBack}>←</BackButton>
      <Title>{title}</Title>
      <Spacer /> {/* Keeps the title centered */}
    </HeaderWrapper>
  );
};

interface DayDetailsProps {
  date: Date;
  onBack: () => void;
  windows: TimeWindow[];
  bookings: Booking[];
}

const DayDetails: React.FC<DayDetailsProps> = ({ date, onBack, windows, bookings }) => {
  const [isMakingNewWindow, setMakingNewWindow] = useState(false);
  const [windowBeingEdited, setWindowBeingEdited] = useState(null);
  const [isMakingNewBooking, setMakingNewBooking] = useState(false);
  const [bookingBeingEdited, setBookingBeingEdited] = useState(null);

  const { t, i18n } = useTranslation();
  const fnsLocale = getDateFnsLocale(i18n.language);

  const handleNewAvailability = () => {
    setMakingNewWindow(true);
  };

  const startEditWindow = (window) => {
    setWindowBeingEdited(window);
  }

  const handleNewBooking = () => {
    setMakingNewBooking(true);
  };

  const startEditBooking = (booking) => {
    setBookingBeingEdited(booking);
  }

  const hasWindows = windows && windows.length > 0;
  const hasBookings = bookings && bookings.length > 0;

  return (
    <DayDetailsWrapper>
      <DayDetailsHeader onBack={onBack} title={format(date, 'PPP', { locale: fnsLocale })} />
      <RowContainer>
        <RowWithLabelAndButton
          label={hasWindows ? t('available.msg') : t('no-availability.msg')}
          buttonContent={(isMakingNewWindow || windowBeingEdited) ? null : <FiPlus size={18} style={{ verticalAlign: 'middle' }} />}
          onButtonClick={handleNewAvailability}
        />
        {hasWindows && windows.map((window, index) => (
          (windowBeingEdited && (window.id === windowBeingEdited.id)) ? (
            <MiniTimeWindowCreator
              key={index}
              window={window}
              onCreate={({ startTime, endTime }) => {
                setWindowBeingEdited(null);
                editTimeWindow(window, startTime, endTime);
              }}
              onCancel={() => setWindowBeingEdited(null)}
              onDelete={(w) => {
                setWindowBeingEdited(null);
                deleteTimeWindow(window.id);
              }}
            />
          ) : (
            <RowWithLabelAndButton
              key={index}
              label={timeRangeFromWindow(window)}
              indentation="8px"
              buttonContent={isMakingNewWindow ? null : <FiEdit size={18} style={{ verticalAlign: 'middle' }} />}
              onButtonClick={() => startEditWindow(window)}
              hoverButton
              borderlessButton
            />
          )
        ))}
        {isMakingNewWindow && <MiniTimeWindowCreator date={date} onCreate={({ startTime, endTime }) => {
          setMakingNewWindow(false)
          createTimeWindow(startTime, endTime)
        }} onCancel={() => setMakingNewWindow(false)} />}
        <RowWithLabelAndButton
          label={hasBookings ? t('bookings.msg') : t('no-bookings.msg')}
          buttonContent={(isMakingNewBooking || bookingBeingEdited) ? null : <FiPlus size={18} style={{ verticalAlign: 'middle' }} />}
          onButtonClick={handleNewBooking}
        />
        {hasBookings && bookings.map((booking, index) => {
          const publicBooking = booking.publicBooking;
          return (
            (bookingBeingEdited && (publicBooking.id === bookingBeingEdited.publicBooking.id)) ? (
              <BookingCreator
                masseurId={auth.currentUser.uid}
                key={index}
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
              />
            ) : (
              <RowWithLabelAndButton
                key={index}
                label={labelFromBooking(booking)}
                indentation="8px"
                buttonContent={isMakingNewBooking ? null : <FiEdit size={18} style={{ verticalAlign: 'middle' }} />}
                onButtonClick={() => startEditBooking(booking)}
                hoverButton
                borderlessButton
              />
            )
          )
        })}
        {isMakingNewBooking && <BookingCreator
          masseurId={auth.currentUser.uid}
          date={date} 
          windows={windows}
          bookings={bookings}
          onCreate={({ startTime, endTime }) => {
            setMakingNewBooking(false)
            //createBooking(startTime, endTime)
          }}
          onCancel={() => setMakingNewBooking(false)} />}
      </RowContainer>
    </DayDetailsWrapper>
  );
};

export default DayDetails;
