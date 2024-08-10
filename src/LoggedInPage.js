// src/LoggedInPage.js
import React, { useState, useEffect } from 'react';
import { logout } from './authService';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig'; // Import db from firebaseConfig
import Header from './components/Header';
import ContentWrapper from './components/ContentWrapper';
import SecondaryButton from './components/SecondaryButton';
import { useTheme } from 'styled-components';
import TimeWindowCreator from './components/TimeWindowCreator';
import { Heading1 } from './components/Heading';

const LoggedInPage = () => {
  const [user, setUser] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsEmailVerified(currentUser.emailVerified);
        fetchUserName(currentUser.uid); // Fetch the user's name from Firestore
      } else {
        navigate('/'); // Redirect to the home page if not logged in
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserName = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'masseurs', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.name); // Set the user's name in state
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
    }
  };

  useEffect(() => {
    let intervalId;

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

  const menuItems = null; //['Home', 'About', 'Services', 'Contact'];

  return (
    <div>
      <Header
        title={`Welcome, ${userName || 'Masseur'}!`}
        logoUrl="tantra_logo_colours3.png"
        menuItems={menuItems}
      />
      <ContentWrapper>
        <Heading1>Welcome, {userName || 'Masseur'}!</Heading1>
        {!isEmailVerified && (
          <p style={{ color: theme.colors.error }}>
            Your email is not verified. Please check your inbox for a
            verification email.
          </p>
        )}
        {isEmailVerified && (
          <>
          <p>You are now logged in and ready to configure your booking system.</p>
          <TimeWindowCreator />
          </>
        )}
        <SecondaryButton onClick={handleLogout}>Logout</SecondaryButton>
      </ContentWrapper>
    </div>
  );
};

export default LoggedInPage;
