// src/model/masseur.ts
import { db } from '../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { Masseur } from './bookingTypes';
import { useEffect, useState } from 'react';
import { useUser } from './user';

const useMasseur = (masseurId = null) => {

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
  const user = useUser();

  useEffect(() => {
    const mid = masseurId || (user ? user.uid : undefined);
    if (mid) {
      const masseurDocRef = doc(db, 'masseurs', mid);
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
  }, [masseurId, user]);

  return masseur;
};


export { useMasseur };