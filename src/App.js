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

    const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQueryDark.addEventListener('change', detectDarkMode);

    // Set the theme initially based on the system preference
    if (mediaQueryDark.matches) {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }

    // Function to detect if the screen size is small (phone)
    const detectPhoneSize = (e) => {
      if (e.matches) {
        setTheme((prevTheme) => ({
          ...prevTheme,
          dimens: {
            ...prevTheme.dimens,
            sideMargin: 10, // Adjust sideMargin for phone size
            // You can also adjust other dimensions here if needed
          },
        }));
      } else {
        // Revert to original dimensions if screen size is not phone-sized
        setTheme((prevTheme) => ({
          ...prevTheme,
          dimens: {
            ...prevTheme.dimens,
            sideMargin: 20, // Revert to the original sideMargin
            // Revert other dimensions if needed
          },
        }));
      }
    };

    const mediaQueryPhone = window.matchMedia(`(max-width: 600px)`);
    mediaQueryPhone.addEventListener('change', detectPhoneSize);

    // Check the current size on load
    detectPhoneSize(mediaQueryPhone);

    // Function to detect if the device can hover
    const detectCanHover = (e) => {
      if (e.matches) {
        setTheme((prevTheme) => ({
          ...prevTheme,
          capabilities: {
            ...prevTheme.capabilities,
            canHover: true, // Device can hover
          },
        }));
      } else {
        setTheme((prevTheme) => ({
          ...prevTheme,
          capabilities: {
            ...prevTheme.capabilities,
            canHover: false, // Device cannot hover
          },
        }));
      }
    };

    const mediaQueryHover = window.matchMedia('(hover: hover)');
    mediaQueryHover.addEventListener('change', detectCanHover);

    // Set the hover capability initially based on the system preference
    detectCanHover(mediaQueryHover);

    // Cleanup the event listeners on unmount
    return () => {
      mediaQueryDark.removeEventListener('change', detectDarkMode);
      mediaQueryPhone.removeEventListener('change', detectPhoneSize);
      mediaQueryHover.removeEventListener('change', detectCanHover);
    };
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
