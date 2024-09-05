// src/model/massageTypes.ts
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, QueryConstraint, where } from 'firebase/firestore';
import { AddonFs, AddonTranslation, AddonTranslationFs, Langs, MassageType, MassageTypeFs, MassageTypeTranslation, MassageTypeTranslationFs, Masseur, MasseurTranslation } from './bookingTypes';
import { useEffect, useMemo, useState } from 'react';


const sub = <T>(
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

const useMassageTypes = (masseurId: string) => {
  const [massageTypes, setMassageTypes] = useState<MassageTypeFs[]>([]);
  const [massageTypeTranslations, setMassageTypeTranslations] = useState<MassageTypeTranslationFs[]>([]);
  const [addons, setAddons] = useState<AddonFs[]>([]);
  const [addonTranslations, setAddonTranslations] = useState<AddonTranslationFs[]>([]);

  useEffect(() => {
    if (masseurId) {
      const masseurConstraint = where('masseurId', '==', masseurId) 
      const unsubs = [
        sub('massageTypes', masseurConstraint, setMassageTypes),
        sub('massageTypeTranslations', masseurConstraint, setMassageTypeTranslations),
        sub('addons', masseurConstraint, setAddons),
        sub('addonTranslations', masseurConstraint, setAddonTranslations)
      ];
    
      return () => {
        for (const unsub of unsubs) {
          unsub();
        }
      };
    }
  }, [masseurId]);

  const richMassageTypes = useMemo<MassageType[]>(() => {    
    return massageTypes.map((massageTypeFs: MassageTypeFs) => ({
      ...massageTypeFs,
      addons: massageTypeFs.addons
        .map((addonId) => addons.find((addon) => addon.id == addonId))
        .filter(Boolean)
        .map((addonFs) => ({
          ...addonFs,
          translations: addonTranslations.reduce((acc, translation) => translation.addonId == addonFs.id
            ? { ...acc, [translation.language]: translation } : acc, 
            {} as Partial<Record<Langs, AddonTranslation>>)
        })),
      translations: massageTypeTranslations.reduce((acc, translation) => translation.massageTypeId == massageTypeFs.id
        ? { ...acc, [translation.language]: translation } : acc, 
        {} as Partial<Record<Langs, MassageTypeTranslation>>)
    }));
  }, [massageTypes, massageTypeTranslations, addons, addonTranslations]);

  return richMassageTypes;
};


export { useMassageTypes };