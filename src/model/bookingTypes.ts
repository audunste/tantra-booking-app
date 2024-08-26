// src/model/bookingTypes.ts

import { Timestamp } from "firebase/firestore";

export interface Masseur {
  id: string;
  email: string;
  name: string;
  username: string;
  currency?: string;
  location?: string;
  description?: string;
  languages?: string[];
}

export interface MasseurTranslation {
  id: string;
  masseurId: string;
  language: string;
  location?: string;
  description?: string;
}

export interface MassageType {
  id: string;
  masseurId?: string;
  minutes: number;
  name: string;
  shortDescription: string;
  description: string;
  cost: number;
}

export interface MassageTypeTranslation {
  id: string;
  massageTypeId: string;
  language: string;
  name: string;
  shortDescription: string;
  description: string;
}

export interface Addon {
  id: string;
  massageTypeId: string;
  minutes: number;
  name: string;
  shortDescription: string;
  description: string;
  cost: number;
}

export interface AddonTranslation {
  id: string;
  addonId: string;
  language: string;
  name: string;
  shortDescription: string;
  description: string;
}

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
  massageTypeId: string;
  addonIds: string[];
  name: string;
  email: string;
  phone?: string;
  comment?: string;
}

export interface CreateBookingData {
  publicBookingId?: string;
  startTime: Date;
  endTime: Date;
  massageTypeId: string;
  addonIds: string[];
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
