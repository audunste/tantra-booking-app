// src/components/TimeWindows.js

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TimeWindowCreator from './TimeWindowCreator';
import { db } from '../firebaseConfig'; // Assumes you're using Firebase
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { createTimeWindow } from '../model/timeWindows';

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

const TimeWindowsCalendarContainer = styled.div`
  width: 100%;
  background-color: red;
`;

const TimeWindowCreatorWrapper = styled.div`
  width: 100%;
`;

const groupByMonthYear = (windows) => {
  const grouped = {};

  windows.forEach((window) => {
    const startDate = new Date(window.startTime);
    const monthYear = `${startDate.getMonth() + 1}-${startDate.getFullYear()}`;

    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }

    grouped[monthYear].push(window);
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

        // Group and sort the windows by month-year
        const grouped = groupByMonthYear(windows);
        setGroupedTimeWindows(grouped);

        console.log('Grouped and sorted time windows:', grouped); // Log the grouped windows for now
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
