// src/LoggedInPage.js
import React, { useState, useEffect } from 'react';
import { logout } from './authService';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Header from './components/Header';
import ContentWrapper from './components/ContentWrapper';
import { useTheme } from 'styled-components';


const LoggedInPage = () => {
  const [user, setUser] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsEmailVerified(currentUser.emailVerified);
      } else {
        navigate('/'); // Redirect to the home page if not logged in
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

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

  const menuItems = ['Home', 'About', 'Services', 'Contact'];

  return (
    <div>
      <Header
        title="Welcome, Masseur!"
        logoUrl="tantra_logo_colours3.png"
        menuItems={menuItems}
      />
      <ContentWrapper>
        <h1>Welcome, Masseur!</h1>
        {!isEmailVerified && (
          <p style={{ color: theme.colors.error }}>
            Your email is not verified. Please check your inbox for a
            verification email.
          </p>
        )}
        <p>You are now logged in.</p>
        <button onClick={handleLogout}>Logout</button>
      </ContentWrapper>
    </div>
  );
};

export default LoggedInPage;
