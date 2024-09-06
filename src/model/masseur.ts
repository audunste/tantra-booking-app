// src/model/masseur.ts
import { db } from '../firebaseConfig';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { Masseur, MasseurTranslation } from './bookingTypes';
import { User } from 'firebase/auth';
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import { sub } from './firestoreService';

const useMasseur = (masseurId) => {

  const defaultMasseur: Masseur = {
    id: '',
    email: '',
    name: '',
    username: '',
    currency: '',
    languages: [],
    translations: {}
  };

  const [masseur, setMasseur] = useState<Masseur>(defaultMasseur);

  useEffect(() => {
    if (masseurId) {
      const masseurDocRef = doc(db, 'masseurs', masseurId);
      const unsubscribeMasseur = onSnapshot(masseurDocRef, (doc) => {
        if (doc.exists()) {
          const m = { ...defaultMasseur, id: doc.id, ...doc.data() }
          console.log("Firestore masseur: ", m)
          setMasseur(m as Masseur); // Set the masseur data in state
        } else {
          console.log('No such document!');
        }
      }, (error) => {
        console.error('Error fetching masseur document:', error);
      });
      return unsubscribeMasseur;
    }
  }, [masseurId]);

  return masseur;
};


export { useMasseur };