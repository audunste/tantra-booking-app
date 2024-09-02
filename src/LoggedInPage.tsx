import React, { useState, useEffect, useMemo } from 'react';
import { logout } from './authService';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from './firebaseConfig'; // Import db from firebaseConfig
import Header from './components/Header';
import ContentWrapper from './components/ContentWrapper';
import SecondaryButton from './components/SecondaryButton';
import { useTheme } from 'styled-components';
import TimeWindows from './components/TimeWindows';
import { Heading1 } from './components/Heading';
import { useTranslation } from 'react-i18next';
import { Masseur, MasseurTranslation } from './model/bookingTypes'
import MasseurConfig from './components/MasseurConfig';
import { editMasseur } from './model/firestoreService';
import FixedSpace from './components/FixedSpace';

const LoggedInPage: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [isEmailVerified, setIsEmailVerified] = useState(user?.emailVerified || false);
  const [masseur, setMasseur] = useState<Masseur | null>(null);
  const [masseurTranslations, setMasseurTranslations] = useState<MasseurTranslation[]>([]);
  const [isEditingMasseur, setEditingMasseur] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsEmailVerified(currentUser.emailVerified);
      } else {
        navigate('/'); // Redirect to the home page if not logged in
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
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
      return () => unsubscribeMasseur();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const masseurTranslationsQuery = query(collection(db, 'masseurTranslations'), where('masseurId', '==', user.uid));
      const unsubscribeMasseurTranslations = onSnapshot(masseurTranslationsQuery, (querySnapshot) => {
        const translations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMasseurTranslations(translations as MasseurTranslation[]);
      });
      return () => unsubscribeMasseurTranslations();
    }
  }, [user]);

  const richMasseur: Masseur | null = useMemo(() => {
    if (user && masseur && masseurTranslations) {
      var m: Masseur = { ...masseur, translations: {} };
      for (const translation of masseurTranslations) {
        m.translations[translation.language] = translation;
      }
      return m;
    }
    return null;
  }, [masseur, masseurTranslations])

  const handleSaveMassseur = (updatedMasseur: Masseur) => {
    console.log("Save updatedMasseur: ", updatedMasseur);
    editMasseur(updatedMasseur);
    setEditingMasseur(false);
  }


  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const reloadUser = async () => {
      if (auth.currentUser) {
        try {
          await auth.currentUser.reload(); // Reloads the user data from Firebase
          const isVerified = auth.currentUser.emailVerified;
          setIsEmailVerified(isVerified);
          if (isVerified) {
            clearInterval(intervalId); // Stop reloading once the email is verified
          }
        } catch (error) {
          console.error('Error reloading user data:', error);
        }
      }
    };

    // Set up interval to reload user every 2 seconds if the email is not verified
    if (!isEmailVerified) {
      intervalId = setInterval(reloadUser, 2000);
    }

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [isEmailVerified]);

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Redirect to the home page after logout
  };

  const menuItems = null; // ['Home', 'About', 'Services', 'Contact'];

  return (
    <div>
      <Header
        title={t('welcomeMasseur_title', { userName: masseur?.name || t('masseur_lbl') })}
        logoUrl="tantra_logo_colours3.png"
        menuItems={menuItems}
      />
      <ContentWrapper>
        <Heading1>{t('welcomeMasseur_title', { userName: masseur?.name || t('masseur_lbl') })}</Heading1>
        {!isEmailVerified && (
          <p style={{ color: theme.colors.error }}>
            {t('emailNotVerified_msg')}
          </p>
        )}
        {isEmailVerified && masseur && (
          <>
            <p>{t('loggedIn_msg')}</p>
            {(!richMasseur.currency || isEditingMasseur) && (
              <MasseurConfig masseur={richMasseur} onSave={handleSaveMassseur} />
            )}
            {richMasseur.currency && !isEditingMasseur && (
              <SecondaryButton onClick={() => setEditingMasseur(true)}>
                {t('edit-profile.act')}
              </SecondaryButton>
            )}
            <FixedSpace height={10} />
            <TimeWindows /> 
          </>
        )}
        <SecondaryButton onClick={handleLogout}>{t('logout_act')}</SecondaryButton>
      </ContentWrapper>
    </div>
  );
};

export default LoggedInPage;
