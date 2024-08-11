import { collection, addDoc } from 'firebase/firestore';

export const createTimeWindow = async (db, startTime, endTime, masseurId) => {
  try {
    const docRef = await addDoc(collection(db, 'timeWindows'), {
      startTime,
      endTime,
      masseurId
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error creating time window: ", error);
  }

};
