// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import Home from './Home';
import LoggedInPage from './LoggedInPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { ThemeProvider } from 'styled-components';
import theme from './theme';

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <Router>
        <Routes>
          <Route path="/" element={!user ? <Home /> : <Navigate to={`/${username}`} />} />
          <Route path="/:username" element={user ? <LoggedInPage /> : <Navigate to="/" />} />
          <Route path="/masseur/forgot-password" element={<ForgotPasswordPage />} />          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
