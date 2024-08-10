// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import Home from './Home';
import LoggedInPage from './LoggedInPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import Terms from './Terms';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { lightTheme, darkTheme } from './theme';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    transition: background-color 0.2s ease; /* Smooth transition when changing theme */
  }
`;

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    // Function to detect the system color scheme
    const detectDarkMode = (e) => {
      if (e.matches) {
        setTheme(darkTheme);
      } else {
        setTheme(lightTheme);
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectDarkMode);

    // Set the theme initially based on the system preference
    if (mediaQuery.matches) {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }

    // Cleanup the event listener on unmount
    return () => mediaQuery.removeEventListener('change', detectDarkMode);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        // Fetch username from Firestore
        const userDoc = await getDoc(doc(db, 'masseurs', user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={!user ? <Home /> : <Navigate to={`/${username}`} />} />
          <Route path="/masseur" element={!user ? <Home /> : <Navigate to={`/${username}`} />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/:username" element={user ? <LoggedInPage /> : <Navigate to="/" />} />
          <Route path="/masseur/forgot-password" element={<ForgotPasswordPage />} />          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
