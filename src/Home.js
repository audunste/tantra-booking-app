// src/Home.js
import React from 'react';
import AuthComponent from './AuthComponent';
import Header from './components/Header';
import ContentWrapper from './components/ContentWrapper';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const menuItems = null; //['Home', 'About', 'Services', 'Contact'];
  const { t } = useTranslation();

  return (
    <div>
      <Header
        title={t('header_title')}
        logoUrl="tantra_logo_colours3.png" 
        menuItems={menuItems}
      />
      <main>
        <ContentWrapper>
          <h1>{t('logIn_title')}</h1>
          <AuthComponent />
        </ContentWrapper>
      </main>
    </div>
  );
};


export default Home;
