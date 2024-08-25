// src/model/bookingTypes.ts

import { Timestamp } from "firebase/firestore";

export interface TimeWindow {
  id: string;
  masseurId: string;
  startTime: Timestamp; 
  endTime: Timestamp;
}

export interface CreateTimeWindowData {
  startTime: Date; 
  endTime: Date;
}

export interface PublicBooking {
  id: string;
  privateBookingId: string | null;
  clientId: string | null;
  masseurId: string;
  startTime: Timestamp; 
  endTime: Timestamp;
}

export interface PrivateBooking {
  id: string;
  publicBookingId: string;
  clientId?: string;
  masseurId: string;
  massageType: string;
  addons: string[];
  name: string;
  email: string;
  phone?: string;
  comment?: string;
}

export interface Booking {
  publicBooking: PublicBooking;
  privateBooking: PrivateBooking | null;
}

export interface TimeWindowsAndBookings {
  timeWindows: TimeWindow[];
  bookings: Booking[];
}

export interface GroupedBookingData {
  [yearMonth: string]: TimeWindowsAndBookings;
}
