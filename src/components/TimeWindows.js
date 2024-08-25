// src/components/TimeWindows.js

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TimeWindowCreator from './TimeWindowCreator';
import { db } from '../firebaseConfig'; // Assumes you're using Firebase
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { createTimeWindow } from '../model/firestoreService';
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
  // Key: yearMonth ex "2024-12"
  // Value: object ex {
  //   timeWindows: [
  //     { startTime, endTime, ... }, ...
  //   ],
  //   bookings: [ {
  //     publicBooking: { },
  //     privateBooking: { }
  //   } ]
  // }
  const [groupedData, setGroupedData] = useState({});
  const user = auth.currentUser;

  const groupByYearMonth = (data, dateField) => {
    return data.reduce((groups, item) => {
      const date = new Date(item[dateField]);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  
      if (!groups[yearMonth]) {
        groups[yearMonth] = { timeWindows: [], bookings: [] };
      }
  
      // Add the item to the correct group
      if (item.publicBooking) {
        groups[yearMonth].bookings.push(item);
      } else {
        groups[yearMonth].timeWindows.push(item);
      }
  
      return groups;
    }, {});
  };
  const mergeData = (groupedTimeWindows, groupedBookings) => {
    const merged = { ...groupedTimeWindows };

    if (groupedBookings) {
      Object.keys(groupedBookings).forEach((yearMonth) => {
        if (!merged[yearMonth]) {
          merged[yearMonth] = { timeWindows: [], bookings: [] };
        }
        merged[yearMonth].bookings = groupedBookings[yearMonth];
      });
    }
    return merged;
  };

  useEffect(() => {
    if (user) {
      const timeWindowsQuery = query(collection(db, 'timeWindows'), where('masseurId', '==', user.uid));
      const unsubscribeTimeWindows = onSnapshot(timeWindowsQuery, (querySnapshot) => {
        const windows = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const groupedTimeWindows = groupByYearMonth(windows, 'startTime');
        setGroupedData((prevData) => mergeData(groupedTimeWindows, prevData));
      });

      const publicBookingsQuery = query(collection(db, 'publicBookings'), where('masseurId', '==', user.uid));
      const unsubscribeBookings = onSnapshot(publicBookingsQuery, async (querySnapshot) => {
        const publicBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const bookingsPromises = publicBookings.map(async (publicBooking) => {
          const privateBookingDoc = await getDoc(doc(db, 'privateBookings', publicBooking.privateBookingId));
          const privateBooking = privateBookingDoc.exists() ? privateBookingDoc.data() : null;
          return { publicBooking, privateBooking };
        });

        const bookings = await Promise.all(bookingsPromises);
        const groupedBookings = groupByYearMonth(bookings, 'publicBooking.startTime');
        setGroupedData((prevData) => mergeData(prevData, groupedBookings));
      });

      return () => {
        unsubscribeTimeWindows();
        unsubscribeBookings();
      };
    }
  }, [user]);

  return (
    <TimeWindowsWrapper>
      <TimeWindowsCalendarContainerWrapper>
        <TimeWindowsCalendarContainer groupedData={groupedData} />
      </TimeWindowsCalendarContainerWrapper>
      <TimeWindowCreatorWrapper>
        <TimeWindowCreator onCreate={({ startTime, endTime }) => {
          createTimeWindow(startTime, endTime)
        }} />
      </TimeWindowCreatorWrapper>
    </TimeWindowsWrapper>
  );
};

export default TimeWindows;
