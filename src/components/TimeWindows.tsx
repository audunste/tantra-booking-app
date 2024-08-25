// src/components/TimeWindows.js

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TimeWindowCreator from './TimeWindowCreator';
import { db } from '../firebaseConfig'; // Assumes you're using Firebase
import { collection, query, where, onSnapshot, getDoc, doc, Timestamp } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { createTimeWindow } from '../model/firestoreService';
import TimeWindowsCalendarContainer from './TimeWindowsCalendarContainer';
import { Booking, GroupedBookingData, PublicBooking, TimeWindow } from '../model/bookingTypes';


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


const TimeWindows = () => {
  const [groupedData, setGroupedData] = useState<GroupedBookingData>({});
  const user = auth.currentUser;

  const groupByYearMonth = (data: any[], dateField: string): GroupedBookingData => {
    return data.reduce((groups, item) => {
      const date = (item[dateField] as Timestamp).toDate();
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[yearMonth]) {
        groups[yearMonth] = { timeWindows: [], bookings: [] };
      }

      // Determine if the item is a TimeWindow or a Booking and add it to the correct array
      if ('publicBooking' in item) {
        groups[yearMonth].bookings.push(item as Booking);
      } else {
        groups[yearMonth].timeWindows.push(item as TimeWindow);
      }

      return groups;
    }, {} as GroupedBookingData);
  };

  useEffect(() => {
    if (auth.currentUser) {
      const timeWindowsQuery = query(collection(db, 'timeWindows'), where('masseurId', '==', auth.currentUser.uid));
      const unsubscribeTimeWindows = onSnapshot(timeWindowsQuery, (querySnapshot) => {
        const windows = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const groupedTimeWindows = groupByYearMonth(windows, 'startTime');
        setGroupedData((prevData) => ({ ...prevData, ...groupedTimeWindows }));
      });

      const publicBookingsQuery = query(collection(db, 'publicBookings'), where('masseurId', '==', auth.currentUser.uid));
      const unsubscribeBookings = onSnapshot(publicBookingsQuery, async (querySnapshot) => {
        const publicBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PublicBooking[];
        const bookingsPromises = publicBookings.map(async (publicBooking) => {
          const privateBookingDoc = await getDoc(doc(db, 'privateBookings', publicBooking.privateBookingId));
          const privateBooking = privateBookingDoc.exists() ? { id: privateBookingDoc.id, ...privateBookingDoc.data() } : null;
          return { publicBooking, privateBooking } as Booking;
        });

        const bookings = await Promise.all(bookingsPromises);
        const groupedBookings = groupByYearMonth(bookings, 'publicBooking.startTime');
        setGroupedData((prevData) => ({ ...prevData, ...groupedBookings }));
      });

      return () => {
        unsubscribeTimeWindows();
        unsubscribeBookings();
      };
    }
  }, [auth.currentUser]);

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
