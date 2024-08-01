// src/LoggedInPage.js
import React from 'react';
import { logout } from './authService';
import { useNavigate } from 'react-router-dom';

const LoggedInPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Redirect to the home page after logout
  };

  return (
    <div>
      <h1>Welcome, Masseur!</h1>
      <p>You are now logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LoggedInPage;
