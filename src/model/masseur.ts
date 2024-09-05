// src/model/masseur.ts
import { db } from '../firebaseConfig';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { Masseur, MasseurTranslation } from './bookingTypes';
import { User } from 'firebase/auth';
import { SetStateAction, useEffect, useMemo, useState } from 'react';

const setUpMasseur = (
  user: User,
  setMasseur: React.Dispatch<SetStateAction<Masseur>>,
  setMasseurTranslations: React.Dispatch<SetStateAction<MasseurTranslation[]>>
) => {
  if (user) {
    const masseurDocRef = doc(db, 'masseurs', user.uid);
    const unsubscribeMasseur = onSnapshot(masseurDocRef, (doc) => {
      if (doc.exists()) {
        const defaults = {
          currency: '',
          languages: []
        }
        const m = { id: doc.id, ...defaults, ...doc.data() }
        console.log("Firestore masseur: ", m)
        setMasseur(m as Masseur); // Set the masseur data in state
      } else {
        console.log('No such document!');
      }
    }, (error) => {
      console.error('Error fetching masseur document:', error);
    });

    const masseurTranslationsQuery = query(collection(db, 'masseurTranslations'), where('masseurId', '==', user.uid));
    const unsubscribeMasseurTranslations = onSnapshot(masseurTranslationsQuery, (querySnapshot) => {
      const translations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMasseurTranslations(translations as MasseurTranslation[]);
    });
    return () => {
      unsubscribeMasseur();
      unsubscribeMasseurTranslations()
    };
  }
};

const makeRichMasseur = (user: User, masseur: Masseur, masseurTranslations: MasseurTranslation[]) => {  
  if (user && masseur && masseurTranslations) {
    var m: Masseur = { ...masseur, translations: {} };
    for (const translation of masseurTranslations) {
      m.translations[translation.language] = translation;
    }
    return m;
  }
  return null;
};

const useMasseurData = (user) => {
  const [masseur, setMasseur] = useState<Masseur | null>(null);
  const [masseurTranslations, setMasseurTranslations] = useState<MasseurTranslation[]>([]);

  useEffect(() => {
    return setUpMasseur(user, setMasseur, setMasseurTranslations);
  }, [user]);

  const richMasseur = useMemo(() => {
    return makeRichMasseur(user, masseur, masseurTranslations);
  }, [masseur, masseurTranslations]);

  return richMasseur;
};


export { useMasseurData };