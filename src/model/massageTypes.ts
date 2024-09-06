// src/model/massageTypes.ts
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, QueryConstraint, where } from 'firebase/firestore';
import { Addon, AddonTranslation, Langs, MassageType, MassageTypeFs, MassageTypeTranslation } from './bookingTypes';
import { useEffect, useMemo, useState } from 'react';
import { subList, subRecord } from './firestoreService';



const useMassageTypes = (masseurId: string) => {
  const [massageTypes, setMassageTypes] = useState<MassageTypeFs[]>([]);
  const [addons, setAddons] = useState<Record<string, Addon>>({});

  useEffect(() => {
    if (masseurId) {
      const masseurConstraint = where('masseurId', '==', masseurId) 
      const unsubs = [
        subList('massageTypes', masseurConstraint, setMassageTypes),
        subRecord('addons', masseurConstraint, setAddons),
      ];
    
      return () => {
        for (const unsub of unsubs) {
          unsub();
        }
      };
    }
  }, [masseurId]);

  const richMassageTypes = useMemo<MassageType[]>(() => {    
    return massageTypes.map((massageTypeFs: MassageTypeFs) => {
      const { addonIds, ...rest } = massageTypeFs;
      return {
        ...rest,
        addons: massageTypeFs.addonIds
          .map((addonId) => addons[addonId])
          .filter(Boolean),
      }
    });
  }, [massageTypes, addons ]);

  return richMassageTypes;
};


export { useMassageTypes };