// src/model/firestoreService.js
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

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

const createTimeWindow = async (startTime, endTime, doMerge = true) => {
  try {
    if (!auth.currentUser) {
      console.error("Error creating time window: No auth.currentUser");
      return
    }
    const masseurId = auth.currentUser.uid
    const docRef = await addDoc(collection(db, 'timeWindows'), {
      startTime,
      endTime,
      masseurId
    });
    console.log("Time window created with ID: ", docRef.id);
    if (doMerge) {
      await mergeTimeWindows();
    }
  } catch (error) {
    console.error("Error creating time window: ", error);
  }
};

const editTimeWindow = async (window, startTime, endTime, doMerge = true) => {
  try {
    if (!auth.currentUser) {
      console.error("Error editing time window: No auth.currentUser");
      return
    }
    await updateDoc(doc(db, 'timeWindows', window.id), {
      startTime,
      endTime,
    });

    console.log("Time window edited with ID: ", window.id);
    if (doMerge) {
      await mergeTimeWindows();
    }
  } catch (error) {
    console.error("Error editing time window: ", error);
  }
};

const deleteTimeWindow = async (window) => {
  try {
    if (!auth.currentUser) {
      console.error("Error deleting time window: No auth.currentUser");
      return
    }
    await deleteDoc(doc(db, 'timeWindows', window.id));

    console.log("Time window deleted with ID: ", window.id);
  } catch (error) {
    console.error("Error deleting time window: ", error);
  }
};

const mergeTimeWindows = async () => {
  try {
    const masseurId = auth.currentUser.uid;
    const timeWindows = await getDocuments('timeWindows');

    // Filter time windows belonging to the current masseur and sort them by startTime
    const masseurWindows = timeWindows
      .filter((window) => window.masseurId === masseurId)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    const windowsToUpdate = new Set();
    const windowsToDelete = [];
    let currentWindow = null;

    masseurWindows.forEach((window) => {
      if (!currentWindow) {
        // Start with the first window
        currentWindow = window;
      } else {
        const currentEnd = new Date(currentWindow.endTime);
        const nextStart = new Date(window.startTime);

        // If windows overlap or touch, merge them
        if (nextStart <= currentEnd) {
          const nextEnd = new Date(window.endTime);
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
      console.log("Attempting delete of time window: " + windowId)
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


export { addDocument, getDocuments, createTimeWindow, mergeTimeWindows, editTimeWindow, deleteTimeWindow };
