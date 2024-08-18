import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '../util/getDateFnsLocale';
import RowWithLabelAndButton from './RowWithLabelAndButton';
import { FiPlus, FiEdit } from 'react-icons/fi'; // Importing icons from react-icons
import MiniTimeWindowCreator from './MiniTimeWindowCreator';
import { useState } from 'react';
import { createTimeWindow, editTimeWindow, deleteTimeWindow } from '../model/firestoreService';
import { timeRangeFromWindow } from '../util/timeWindowUtil';

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

const DayDetails = ({ date, onBack, windows, bookings }) => {
  const [isMakingNew, setMakingNew] = useState(false);
  const [windowBeingEdited, setWindowBeingEdited] = useState(null);

  const { t, i18n } = useTranslation();
  const fnsLocale = getDateFnsLocale(i18n.language);

  const handleNewAvailability = () => {
    setMakingNew(true);
  };

  const startEdit = (window) => {
    setWindowBeingEdited(window);
  }

  return (
    <DayDetailsWrapper>
      <DayDetailsHeader onBack={onBack} title={format(date, 'PPP', { locale: fnsLocale })} />
      <RowContainer>
        <RowWithLabelAndButton
          label={windows.length > 0 ? t('Available') : t('No availability')}
          buttonContent={(isMakingNew || windowBeingEdited) ? null : <FiPlus size={18} style={{ verticalAlign: 'middle' }} />}
          onButtonClick={handleNewAvailability}
        />
        {windows.map((window, index) => (
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
                deleteTimeWindow(window);
              }}
            />
          ) : (
            <RowWithLabelAndButton
              key={index}
              label={timeRangeFromWindow(window)}
              indentation="8px"
              buttonContent={isMakingNew ? null : <FiEdit size={18} style={{ verticalAlign: 'middle' }} />}
              onButtonClick={() => startEdit(window)}
              hoverButton
              borderlessButton
            />
          )
        ))}
        {isMakingNew && <MiniTimeWindowCreator date={date} onCreate={({ startTime, endTime }) => {
          setMakingNew(false)
          createTimeWindow(startTime, endTime)
        }} onCancel={() => setMakingNew(false)} />}
      </RowContainer>
    </DayDetailsWrapper>
  );
};

export default DayDetails;
