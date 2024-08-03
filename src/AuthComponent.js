// src/AuthComponent.js
import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { signUpWithEmail, signInWithEmail } from './authService';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import PrimaryButton from './components/PrimaryButton';
import styled from 'styled-components';
import FloatingLabelInputWithError from './components/FloatingLabelInputWithError';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 100%;
  max-width: 400px;
  margin: 0 0;
  padding: 0 0;
  box-sizing: border-box;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 2px solid ${(props) => props.borderColor || 'gray'};
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1em;
  outline: none;

  &:focus {
    border-color: ${(props) => props.borderColor || '#ff8c00'};
  }
`;

const SwitchAuthButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text};
  font-size: 0.9em;
  cursor: pointer;
  margin-top: 10px;
  text-decoration: underline;
`;

const AuthComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [suggestUsername, setSuggestUsername] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          // Retrieve the username from Firestore
          const userDoc = await getDoc(doc(db, 'masseurs', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            navigate(`/${userData.username}`);
          }
        }
      });
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async () => {
    await signUpWithEmail(email, password, username, name);
    navigate(`/${username}`);
  };

  const handleSignIn = async () => {
    await signInWithEmail(email, password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Please enter a valid email address.';
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/; // Regex to check for at least one digit
    const hasLetter = /[a-zA-Z]/; // Regex to check for at least one letter
  
    if (password.length < minLength) {
      return 'Password must be at least 8 characters long.';
    }
  
    if (!hasNumber.test(password)) {
      return 'Password must contain at least one number.';
    }
  
    if (!hasLetter.test(password)) {
      return 'Password must contain at least one letter.';
    }
  
    return ''; // Return an empty string if all validations pass
  };

  const validateConfirmedPassword = (confirmed) => {
    if (confirmed === password) {
      return '';
    }
    return 'Passwords must be equal'
  };

  const validateUsername = (username) => {
    if (username.length < 3) {
      return 'Username must be at least 3 characters long.'
    }

    if (username.length > 20) {
      return 'Username must not be longer than 20 characters long.'
    }

    // Check for leading or trailing hyphens
    if (/^-|-$/.test(username)) {
      return "Username cannot start or end with a hyphen.";
    }

    // Check for repeated hyphens
    if (/--/.test(username)) {
      return "Username cannot contain consecutive hyphens.";
    }

    // Check for invalid characters
    if (/[^a-z0-9-]/.test(username)) {
      return "Only lowercase letters, numbers, and hyphens.";
    }
  
    // If all checks pass
    return '';
  };
  

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (suggestUsername) {
      let safeStr = value.replace(/[^a-zA-Z0-9-]+/g, '-');
      safeStr = safeStr.toLowerCase().slice(0, 20);
      safeStr = safeStr.replace(/-+/g, '-');
      safeStr = safeStr.replace(/^-+|-+$/g, '');
      setUsername(safeStr);
    }
  }

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value)
    setSuggestUsername(value.length > 0 ? false : true)
  }

  const confirmedPasswordError =
    isSignUp && confirmedPassword.length > 0 && password !== confirmedPassword
      ? 'Passwords must be equal'
      : '';

  return (
    <AuthContainer>
      <FloatingLabelInputWithError
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        validate={validateEmail}
      />
      <FloatingLabelInputWithError
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        validate={validatePassword}
      />
      {isSignUp && (
        <>
          <FloatingLabelInputWithError
            type="password"
            label="Confirm Password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            validate={validateConfirmedPassword}
          />
          <FloatingLabelInputWithError
            type="text"
            label="Name"
            value={name}
            onChange={handleNameChange}
          />
          <FloatingLabelInputWithError
            type="text"
            label="Username"
            value={username}
            onChange={handleUsernameChange}
            validate={validateUsername}
          />
        </>
      )}
      <PrimaryButton onClick={isSignUp ? handleSignUp : handleSignIn}>
        {isSignUp ? 'Sign Up' : 'Log In'}
      </PrimaryButton>
      <SwitchAuthButton onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Switch to Log In' : 'Switch to Sign Up'}
      </SwitchAuthButton>
    </AuthContainer>
  );
};

export default AuthComponent;
