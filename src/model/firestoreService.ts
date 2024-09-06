// src/model/firestoreService.ts
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, setDoc, Timestamp, QueryConstraint, query, onSnapshot } from 'firebase/firestore';
import { Masseur, TimeWindow } from './bookingTypes';

// Add a new document with a generated ID
const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Get all documents from a collection
const getDocuments = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const documents = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
  return documents;
};

const createTimeWindow = async (startTime: Date, endTime: Date, doMerge = true) => {
  try {
    if (!auth.currentUser) {
      console.error("Error creating time window: No auth.currentUser");
      return
    }

    const masseurId = auth.currentUser.uid
    const docRef = await addDoc(collection(db, 'timeWindows'), {
      masseurId,
      startTime: Timestamp.fromDate(startTime),
      endTime: Timestamp.fromDate(endTime),
    });
    console.log("Time window created with ID: ", docRef.id);
    if (doMerge) {
      await mergeTimeWindows();
    }
  } catch (error) {
    console.error("Error creating time window: ", error);
  }
};

const editTimeWindow = async (window: TimeWindow, startTime: Date, endTime: Date, doMerge = true) => {
  try {
    if (!auth.currentUser) {
      console.error("Error editing time window: No auth.currentUser");
      return
    }
    await updateDoc(doc(db, 'timeWindows', window.id), {
      startTime: Timestamp.fromDate(startTime),
      endTime: Timestamp.fromDate(endTime),
    });

    console.log("Time window edited with ID: ", window.id);
    if (doMerge) {
      await mergeTimeWindows();
    }
  } catch (error) {
    console.error("Error editing time window: ", error);
  }
};

const deleteTimeWindow = async (id: string) => {
  try {
    if (!auth.currentUser) {
      console.error("Error deleting time window: No auth.currentUser");
      return
    }
    await deleteDoc(doc(db, 'timeWindows', id));

    console.log("Time window deleted with ID: ", id);
  } catch (error) {
    console.error("Error deleting time window: ", error);
  }
};

const mergeTimeWindows = async () => {
  try {
    const masseurId = auth.currentUser.uid;
    
    // Cast the result of getDocuments as an array of TimeWindow
    const timeWindows = await getDocuments('timeWindows') as TimeWindow[];

    // Filter time windows belonging to the current masseur and sort them by startTime
    const masseurWindows = timeWindows
      .filter((window) => window.masseurId === masseurId)
      .sort((a, b) => a.startTime.toMillis() - b.startTime.toMillis());

    const windowsToUpdate = new Set<TimeWindow>();
    const windowsToDelete = [];
    let currentWindow: TimeWindow | null = null;

    masseurWindows.forEach((window) => {
      if (!currentWindow) {
        // Start with the first window
        currentWindow = window;
      } else {
        const currentEnd = currentWindow.endTime.toMillis();
        const nextStart = window.startTime.toMillis();

        // If windows overlap or touch, merge them
        if (nextStart <= currentEnd) {
          const nextEnd = window.endTime.toMillis();
          // Extend the current window's endTime if necessary
          if (nextEnd > currentEnd) {
            currentWindow.endTime = window.endTime;
            windowsToUpdate.add(currentWindow);
          }
          // Mark the overlapping window for deletion
          windowsToDelete.push(window.id);
        } else {
          // If they don't overlap, push the current window to update and start a new one
          currentWindow = window;
        }
      }
    });

    // Delete old windows that were merged
    for (const windowId of windowsToDelete) {
      console.log("Attempting delete of time window: " + windowId);
      await deleteDoc(doc(db, 'timeWindows', windowId));
    }

    // Update the necessary windows
    for (const window of windowsToUpdate) {
      console.log("Attempting time window update: ", window.id);
      await updateDoc(doc(db, 'timeWindows', window.id), {
        startTime: window.startTime,
        endTime: window.endTime
      });
    }

    console.log("Merged and updated time windows:", Array.from(windowsToUpdate));
  } catch (error) {
    console.error("Error merging time windows: ", error);
  }
};

const createBooking = async (masseurId, startTime, endTime, massageType, addons, name, email, phone = '', comment = '', clientId = null) => {
  try {

    // Create a booking in the publicBookings collection
    const publicBookingRef = await addDoc(collection(db, 'publicBookings'), {
      privateBookingId: null,  // Placeholder for the ID of the privateBookings document
      clientId,
      masseurId,
      startTime,
      endTime,
    });

    // Create the private booking details
    const privateBookingRef = await addDoc(collection(db, 'privateBookings'), {
      publicBookingId: publicBookingRef.id,
      clientId,
      masseurId,
      massageType,
      addons,
      name,
      email,
      phone,
      comment,
    });

    // Update the booking with the privateBookingId
    await setDoc(doc(db, 'publicBookings', publicBookingRef.id), {
      privateBookingId: privateBookingRef.id,
    }, { merge: true });

    console.log("Booking created with ID: ", publicBookingRef.id);
    return publicBookingRef.id; // Return the document ID for further use
  } catch (error) {
    console.error("Error creating booking: ", error);
  }
};

const editBooking = async (publicBookingId, updatedPublicFields, updatedPrivateFields) => {
  try {
    const publicBookingRef = doc(db, 'publicBookings', publicBookingId);

    // Update the booking with the provided fields
    await updateDoc(publicBookingRef, updatedPublicFields);

    if (updatedPrivateFields) {
      const privateBookingId = (await getDoc(publicBookingRef)).data().privateBookingId;
      const privateBookingRef = doc(db, 'privateBookings', privateBookingId);

      await updateDoc(privateBookingRef, updatedPrivateFields);
    }

    console.log("Booking updated with ID: ", publicBookingId);
  } catch (error) {
    console.error("Error updating booking: ", error);
  }
};

const deleteBooking = async (publicBookingId) => {
  try {
    const publicBookingRef = doc(db, 'publicBookings', publicBookingId);
    const privateBookingId = (await getDoc(publicBookingRef)).data().privateBookingId;
    const privateBookingRef = doc(db, 'privateBookings', privateBookingId);

    await deleteDoc(publicBookingRef);
    await deleteDoc(privateBookingRef);

    console.log("Booking deleted with ID: ", publicBookingId);
  } catch (error) {
    console.error("Error deleting booking: ", error);
  }
};

const editMasseur = async (updatedMasseur: Masseur) => {
  try {
    const masseurRef = doc(db, 'masseurs', updatedMasseur.id);

    // Update the booking with the provided fields
    await updateDoc(masseurRef, {
      currency: updatedMasseur.currency,
      languages: updatedMasseur.languages,
      translations: updatedMasseur.translations
    });

    console.log("Masseur edited with id: ", updatedMasseur.id);
  } catch (error) {
    console.error("Error updating masseur: ", error);
  }
};

const subList = <T>(
  collectionName: string,
  filter: QueryConstraint,
  setter: (values: T[]) => void,
  defaults: Partial<T> = {}
) => {
  const myQuery = query(collection(db, collectionName), filter);
  const myUnsubscribe = onSnapshot(myQuery, (querySnapshot) => {
    const values = querySnapshot.docs.map(doc => {
      const data = doc.data() as T; 
      return { ...defaults, id: doc.id, ...data };
    });
    setter(values);
  });
  return myUnsubscribe;
};

const subRecord = <T>(
  collectionName: string,
  filter: QueryConstraint,
  setter: (values: Record<string, T>) => void,
  defaults: Partial<T> = {}
) => {
  const myQuery = query(collection(db, collectionName), filter);
  const myUnsubscribe = onSnapshot(myQuery, (querySnapshot) => {
    const record: Record<string, T> = {}
    for (const doc of querySnapshot.docs) {
      const data = doc.data() as T;
      record[doc.id] = { ...defaults, id: doc.id, ...data }
    }
    setter(record);
  });
  return myUnsubscribe;
};

export {
  addDocument,
  getDocuments,
  createTimeWindow,
  editTimeWindow,
  deleteTimeWindow,
  createBooking,
  editBooking,
  deleteBooking,
  editMasseur,
  subList,
  subRecord,
};
