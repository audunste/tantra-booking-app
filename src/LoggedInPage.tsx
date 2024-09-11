import React, { useState, useEffect } from 'react';
import { logout } from './authService';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Import db from firebaseConfig
import Header from './components/Header';
import ContentWrapper from './components/ContentWrapper';
import SecondaryButton from './components/SecondaryButton';
import { useTheme } from 'styled-components';
import TimeWindows from './components/TimeWindows';
import { Heading1, Heading2 } from './components/Heading';
import { useTranslation } from 'react-i18next';
import { useMasseur } from './model/masseur';
import Profile from './components/Profile';

const LoggedInPage: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [isEmailVerified, setIsEmailVerified] = useState(user?.emailVerified || false);
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();
  const masseur = useMasseur(user.uid);

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

  const menuItems = [t('home.lbl', t('contact.lbl'))]; // ['Home', 'About', 'Services', 'Contact'];

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
            <Heading2>{t('profile.title')}</Heading2>
            <Profile />
            <Heading2>{t('availability-and-bookings.title')}</Heading2>
            <TimeWindows /> 
          </>
        )}
        <SecondaryButton onClick={handleLogout}>{t('logout_act')}</SecondaryButton>
      </ContentWrapper>
    </div>
  );
};

export default LoggedInPage;
