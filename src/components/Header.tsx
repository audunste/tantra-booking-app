import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useMasseur } from '../model/masseur';

// Styled-components for the header
const HeaderContainer = styled.header`
  position: relative;
  width: 100%;
  height: 200px;
  background-image: url('/masseur_header_background_dark.png');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.onPrimary};
`;

const ContentWrapper = styled.div`
  max-width: 1040px;
  width: 100%;
  padding: 0 16px;
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
  flex-grow: 1;
`;

const Logo = styled.img`
  height: 64px;
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
  justify-content: center;
  align-items: flex-end;
`;

const MenuContainer = styled.nav`
  max-width: 1040px;
  width: 100%;
  padding: 10px 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: left;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text};
  font-size: 1em;
  font-weight: 600;
  margin: 0 10px;
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

const LanguagePickerButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  margin-left: 10px;
  margin-top: -8px;
  margin-bottom: -8px;

  &:focus {
    outline: none;
  }
`;

const DropdownMenu = styled.ul<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};

  li {
    padding: 10px 20px;
    cursor: pointer;

    &:hover {
      background-color: ${(props) => props.theme.colors.primaryLight};
    }
  }
`;

const Header = ({ title, logoUrl, menuItems }) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const masseur = useMasseur();
  
  const langToDisplayString = {
    en: t('english.lbl'),
    nb: t('norwegian.lbl'),
    de: t('german.lbl'),
    es: t('spanish.lbl'),
  };
  const langToEmoji = {
    en: '🇬🇧',
    nb: '🇳🇴',
    de: '🇩🇪',
    es: '🇪🇸',
  };
  const languages = masseur ? masseur.languages : [ 'en', 'nb', 'de', 'es' ];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setMenuOpen(false); // Close menu after selecting
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) && 
        buttonRef.current && 
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

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
          {menuItems &&
            menuItems.map((item, index) => (
              <MenuButton key={index}>{item}</MenuButton>
            ))}
          <LanguagePickerButton ref={buttonRef} onClick={() => setMenuOpen(!isMenuOpen)}>
            {langToEmoji[i18n.language]} {/* Show the emoji for the current language */}
          </LanguagePickerButton>
          <DropdownMenu ref={dropdownRef} $isOpen={isMenuOpen}>
            {languages.map((langCode) => (
              <li key={langCode} onClick={() => handleLanguageChange(langCode)}>
                {langToEmoji[langCode]} {langToDisplayString[langCode]}
              </li>
            ))}
          </DropdownMenu>
        </MenuContainer>
      </MenuBar>
      <GradientLine />
    </HeaderContainer>
  );
};

export default Header;
