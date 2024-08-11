// src/ForgotPasswordPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import ContentWrapper from './components/ContentWrapper';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebaseConfig';
import styled from 'styled-components';
import FloatingLabelInputWithError from './components/FloatingLabelInputWithError';
import PrimaryButton from './components/PrimaryButton';
import { useTranslation } from 'react-i18next';

// Styled components
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

const Message = styled.p`
  color: ${(props) => (props.$success ? 'green' : 'red')};
  font-size: 0.9em;
  margin-top: 10px;
  margin-left: 12px;
`;

const ForgotPasswordPage = () => {
  const menuItems = null; //['Home', 'About', 'Services', 'Contact'];

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromQuery = queryParams.get('email');
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [location.search]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setMessage(t('passwordResetEmailSent_msg'));
    } catch (error) {
      setSuccess(false);
      setMessage(t('passwordResetEmailFailed_msg'));
    }
  };

  return (
    <div>
      <Header
        title={t('header_title')}
        logoUrl="/tantra_logo_colours3.png"
        menuItems={menuItems}
      />
      <main>
        <ContentWrapper>
          <h1>{t('resetPassword')}</h1>
          <AuthContainer>
            {!success && (<form onSubmit={handlePasswordReset}>
              <FloatingLabelInputWithError
                type="email"
                label={t('enterEmail_lbl')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <PrimaryButton type="submit">{t('sendResetEmail_act')}</PrimaryButton>
            </form>)}
            {message && <Message $success={success}>{message}</Message>}
            {success && (
              <PrimaryButton onClick={() => navigate('/masseur')}>{t('backToLogin_act')}</PrimaryButton>
            )}
          </AuthContainer>
        </ContentWrapper>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
