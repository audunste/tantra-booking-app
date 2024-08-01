// src/Home.js
import React from 'react';
import AuthComponent from './AuthComponent';
import Header from './components/Header';
import ContentWrapper from './components/ContentWrapper';

const Home = () => {
  const menuItems = ['Home', 'About', 'Services', 'Contact'];

  return (
    <div>
      <Header
        title="Tantra Masseur Booking System"
        logoUrl="tantra_logo_colours3.png" 
        menuItems={menuItems}
      />
      <main>
        <ContentWrapper>
          <h1>Please log in or sign up</h1>
          <AuthComponent />
        </ContentWrapper>
      </main>
    </div>
  );
};


export default Home;
