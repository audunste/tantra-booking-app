// src/components/TimeWindows.js

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TimeWindowCreator from './TimeWindowCreator';
import { db } from '../firebaseConfig'; // Assumes you're using Firebase
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { createTimeWindow } from '../model/timeWindows';
import TimeWindowsCalendarContainer from './TimeWindowsCalendarContainer';


const TimeWindowsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${(props) => props.theme.dimens.gap}px;
`;

const TimeWindowsCalendarContainerWrapper = styled.div`
  width: 100%;
`;

const TimeWindowCreatorWrapper = styled.div`
  width: 100%;
`;

const groupByYearMonth = (windows) => {
  const grouped = {};

  windows.forEach((window) => {
    const startDate = new Date(window.startTime);
    const yearMonth = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;

    if (!grouped[yearMonth]) {
      grouped[yearMonth] = [];
    }

    grouped[yearMonth].push(window);
  });

  // Sort each month's windows by startTime
  for (const key in grouped) {
    grouped[key].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }

  return grouped;
};

const TimeWindows = () => {
  const [groupedTimeWindows, setGroupedTimeWindows] = useState({});
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      // Real-time listener for time windows
      const q = query(collection(db, 'timeWindows'), where('masseurId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const windows = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Group and sort the windows by year-month
        const grouped = groupByYearMonth(windows);
        setGroupedTimeWindows(grouped);

        console.log('Grouped time windows:', grouped);
      }, (error) => {
        console.error('Error fetching time windows:', error);
      });

      // Clean up the listener on unmount
      return () => unsubscribe();
    }
  }, [user]);

  const handleCreateTimeWindow = ({ startTime, endTime }) => {
    if (user) {
      createTimeWindow(db, startTime, endTime, user.uid);
    }
  };

  return (
    <TimeWindowsWrapper>
      <TimeWindowsCalendarContainerWrapper>
        <TimeWindowsCalendarContainer groupedTimeWindows={groupedTimeWindows} />
      </TimeWindowsCalendarContainerWrapper>
      <TimeWindowCreatorWrapper>
        <TimeWindowCreator onCreate={handleCreateTimeWindow} />
      </TimeWindowCreatorWrapper>
    </TimeWindowsWrapper>
  );
};

export default TimeWindows;
