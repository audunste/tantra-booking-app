// src/components/Header.js
import React from 'react';
import styled from 'styled-components';

// Styled-components for the header
const HeaderContainer = styled.header`
  position: relative;
  width: 100%;
  height: 200px; /* Adjust height as needed */
  background-image: url('/masseur_header_background_dark.png');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center content vertically */
  align-items: center; /* Centers children horizontally */
  color: ${(props) => props.theme.colors.onPrimary};
`;

const ContentWrapper = styled.div`
  max-width: 1040px;
  width: 100%;
  padding: 0 16px; /* 16px margin on smaller screens */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`;

const LogoAndTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  flex-grow: 1; /* Allows the logo and title to occupy available space */
`;

const Logo = styled.img`
  height: 64px; /* Adjust logo size */
  margin-right: 20px;
`;

const Title = styled.h1`
  font-size: 1.5em;
  margin: 0;
  text-shadow: 0px 1px 2px ${(props) => props.theme.colors.onPrimaryShadow};
`;

const MenuBar = styled.div`
  width: 100%;
  background: ${(props) => props.theme.colors.imageOverlayBackground};
  display: flex;
  justify-content: center; /* Centers the inner container */
  align-items: flex-end; /* Aligns items to the bottom of the nav */
`;

const MenuContainer = styled.nav`
  max-width: 1040px;
  width: 100%;
  padding: 10px 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: left; /* Centers the menu items */
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text};
  font-size: 1em;
  font-weight: 600; /* Semi-bold text */
  margin: 0 10px; /* Narrower margin between items */
  padding: 5px 10px;
  cursor: pointer;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);

  &:hover {
    text-decoration: underline;
  }
`;

const GradientLine = styled.div`
  height: 5px;
  width: 100%;
  background: linear-gradient(to right, 
    ${(props) => props.theme.colors.gradientStart},
    ${(props) => props.theme.colors.primary},
    ${(props) => props.theme.colors.gradientEnd}
  );
`;

// 206, 117, 0

// Header component
const Header = ({ title, logoUrl, menuItems }) => {
  return (
    <HeaderContainer>
      <ContentWrapper>
        <LogoAndTitle>
          <Logo src={logoUrl} alt="Logo" />
          <Title>{title}</Title>
        </LogoAndTitle>
      </ContentWrapper>
      <MenuBar>
        <MenuContainer>
          {menuItems && menuItems.map((item, index) => (
            <MenuButton key={index}>{item}</MenuButton>
          ))}
        </MenuContainer>
      </MenuBar>
      <GradientLine />
    </HeaderContainer>
  );
};

export default Header;
