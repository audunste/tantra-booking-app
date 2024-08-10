// src/theme.js

const baseTheme = {
  dimens: {
    sideMargin: 20,
    gap: 10,
  },
}

export const lightTheme = {
  ...baseTheme,
  colors: {
    primary: '#e57300', 
    gradientStart: '#bf4000', 
    gradientEnd: '#f28d00',
    disabled: '#aa9988',
    onPrimary: '#ebe7e4',
    onPrimaryShadow: 'rgba(24, 12, 0, 0.6)',
    secondary: '#ebe7e4',
    background: '#fff',
    backgroundHover: '#d9d5d2',
    text: '#321',
    secondaryText: '#887858',
    error: '#bb1107',
    border: '#786848',
    imageOverlayBackground: 'rgba(255, 255, 255, 0.7)',
  },
};

export const darkTheme = {
  ...baseTheme,
  colors: {
    primary: '#e57300', 
    gradientStart: '#bf4000', 
    gradientEnd: '#f28d00',
    disabled: '#5c5c5c', 
    onPrimary: '#e5e2df', 
    onPrimaryShadow: 'rgba(24, 12, 0, 0.6)',
    secondary: '#444', 
    background: '#1c1c1b', 
    backgroundHover: '#2c2b2a', 
    text: '#e5e2df', 
    secondaryText: '#b0a589', 
    error: '#ff6659',
    border: '#807e7c', 
    imageOverlayBackground: 'rgba(0, 0, 0, 0.5)',
  },
};
