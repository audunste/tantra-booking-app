// src/ForgotPasswordPage.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ContentWrapper from './components/ContentWrapper';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebaseConfig';
import styled from 'styled-components';
import FloatingLabelInputWithError from './components/FloatingLabelInputWithError';
import PrimaryButton from './components/PrimaryButton';

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
  color: ${(props) => props.success ? 'green' : 'red'};
  font-size: 0.9em;
  margin-top: 10px;
`;

const ForgotPasswordPage = () => {
  const menuItems = ['Home', 'About', 'Services', 'Contact'];

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (error) {
      setSuccess(false);
      setMessage('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div>
      <Header
        title="Tantra Masseur Booking System"
        logoUrl="/tantra_logo_colours3.png" 
        menuItems={menuItems}
      />
      <main>
        <ContentWrapper>
          <h1>Reset Password</h1>
          <AuthContainer>
            <form onSubmit={handlePasswordReset}>
              <FloatingLabelInputWithError
                type="email"
                label="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <PrimaryButton type="submit">Send Reset Email</PrimaryButton>
            </form>
          {message && <Message success={success}>{message}</Message>}
          </AuthContainer>
        </ContentWrapper>
      </main>
    </div>
  );
};


export default ForgotPasswordPage;
