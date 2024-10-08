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
import ErrorMessage from './components/ErrorMessage';
import CheckboxWithError from './components/CheckboxWithError';
import { useTranslation } from 'react-i18next';

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

const SwitchAuthButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text};
  font-size: 0.9em;
  cursor: pointer;
  margin-top: 10px;
  text-decoration: underline;
`;

const ForgotPasswordLink = styled.a`
  margin-top: 4px;
  margin-left: 4px;
  text-align: left;
`;


const AuthComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [suggestUsername, setSuggestUsername] = useState(true);
  const [error, setError] = useState(null);
  const [forceValidate, setForceValidate] = useState(false);
  const navigate = useNavigate();

  const { t } = useTranslation();

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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null)
    const error = await signUpWithEmail(email, password, username, name);
    if (error) {
      setError(error)
    } else {
      navigate(`/${username}`);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null)
    const error = await signInWithEmail(email, password);
    if (error) {
      setError(error)
    }
  };

  const handleInvalidSignUp = async (e) => {
    e.preventDefault();
    setForceValidate(true);
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : t('invalidEmail_msg');
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/; // Regex to check for at least one digit
    const hasLetter = /[a-zA-Z]/; // Regex to check for at least one letter
  
    if (password.length < minLength) {
      return t('passwordMinLength_msg');
    }
  
    if (!hasNumber.test(password)) {
      return t('passwordNumber_msg');
    }
  
    if (!hasLetter.test(password)) {
      return t('passwordLetter_msg');
    }
  
    return ''; // Return an empty string if all validations pass
  };

  const validateConfirmedPassword = (confirmed) => {
    if (confirmed === password) {
      return '';
    }
    return t('passwordsUnequal_msg')
  };

  const validateName = (name) => {
    if (name.length < 3) {
      return t('nameMinLength_msg')
    }

    if (name.length > 40) {
      return t('nameMaxLength_msg')
    }

    return '';
  }

  const validateUsername = (username) => {
    if (username.length < 3) {
      return t('usernameMinLength_msg')
    }

    if (username.length > 20) {
      return t('usernameMaxLength_msg')
    }

    // Check for leading or trailing hyphens
    if (/^-|-$/.test(username)) {
      return t('usernameStartOrEndHyphen_msg');
    }

    // Check for repeated hyphens
    if (/--/.test(username)) {
      return t('usernameConsecutiveHyphens_msg');
    }

    // Check for invalid characters
    if (/[^a-z0-9-]/.test(username)) {
      return t('usernameInvalidCharacters_msg');
    }
  
    // If all checks pass
    return '';
  };

  const validateTermsAccepted = (termsAccepted) => {
    if (!termsAccepted) {
      return t('termsUnaccepted_msg');
    }
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

  const encodedEmail = encodeURIComponent(email);

  const signUpInvalid =
    validateEmail(email)
    || validatePassword(password)
    || validateConfirmedPassword(confirmedPassword)
    || validateName(name)
    || validateUsername(username)
    || validateTermsAccepted(termsAccepted);

  return (
    <AuthContainer>
      <form onSubmit={isSignUp ? (signUpInvalid ? handleInvalidSignUp : handleSignUp) : handleSignIn}>
        <FloatingLabelInputWithError
          type="email"
          label={t('email_lbl')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          validate={validateEmail}
          forceValidate={forceValidate}
        />
        <FloatingLabelInputWithError
          type="password"
          label={t('password_lbl')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          validate={isSignUp ? validatePassword : undefined}
          forceValidate={forceValidate}
        />
        {isSignUp && (
          <>
            <FloatingLabelInputWithError
              type="password"
              label={t('confirmPassword_lbl')}
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              validate={validateConfirmedPassword}
              forceValidate={forceValidate}
              />
            <FloatingLabelInputWithError
              type="text"
              label={t('name_lbl')}
              value={name}
              onChange={handleNameChange}
              validate={validateName}
              forceValidate={forceValidate}
            />
            <FloatingLabelInputWithError
              type="text"
              label={t('username_lbl')}
              value={username}
              onChange={handleUsernameChange}
              validate={validateUsername}
              forceValidate={forceValidate}
              info={t('signup.username.info', { host: window.location.host || "example.com" })}
            />
            <CheckboxWithError
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              label={
                <span>
                  {t('acceptTerms_prefix')}{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer">
                    {t('acceptTerms_link')}
                  </a>
                </span>
              }
              validate={validateTermsAccepted}
              forceValidate={forceValidate}
            />
          </>
        )}
        {(error && isSignUp) && (
          <ErrorMessage $show={true}>{error}</ErrorMessage>
        )}
        {(error && !isSignUp) && (
          <ErrorMessage $show={true}>{error}<ForgotPasswordLink href={`/masseur/forgot-password?email=${encodedEmail}`}>{t('forgotPassword_link')}</ForgotPasswordLink></ErrorMessage>
        )}
        <PrimaryButton type="submit" $fill={true}>
          {isSignUp ? t('signUp_act') : t('logIn_act')}
        </PrimaryButton>
      </form>
      <SwitchAuthButton onClick={() => {
          setError(null);
          setIsSignUp(!isSignUp);
        }}>
        {isSignUp ? t('switchToLogIn_link') : t('switchToSignUp_link')}
      </SwitchAuthButton>
    </AuthContainer>
  );
};

export default AuthComponent;
