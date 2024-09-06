// src/model/bookingTypes.ts

import { Timestamp } from "firebase/firestore";

export type Langs = "en" | "nb" | "de" | "es";

// This mostly just describes the firestore schema
// for the collections.
// Note that id is not stored in the data,
// but is merged into the object on read.
export interface MassageTypeFs {
  id: string;
  masseurId: string;
  minutes: number;
  cost: number;
  addons: string[];
}
export interface MassageTypeTranslationFs {
  id: string;
  massageTypeId: string;
  language: string;
  name: string;
  shortDescription: string;
  description: string;
}
export interface AddonFs {
  id: string;
  masseurId: string;
  minutes: number;
  cost: number;
}
export interface AddonTranslationFs {
  id: string;
  addonId: string;
  language: string;
  name: string;
  shortDescription: string;
  description: string;
}

// This is used when giving masseur props to the view
export interface Masseur {
  id: string;
  email: string;
  name: string;
  username: string;
  currency: string;
  languages: string[];
  translations: Partial<Record<Langs, MasseurTranslation>>
}

export interface MasseurTranslation {
  location?: string;
  description?: string;
}

export interface MassageType {
  id: string;
  masseurId: string;
  minutes: number;
  cost: number;
  addons: Addon[];
  translations: Partial<Record<Langs, MassageTypeTranslation>>
}

export interface Addon {
  id: string;
  masseurId: string;
  minutes: number;
  cost: number;
  translations: Partial<Record<Langs, AddonTranslation>>
}

export interface MassageTypeTranslation {
  id: string;
  massageTypeId: string;
  language: string;
  name: string;
  shortDescription: string;
  description: string;
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
