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
    primaryHover: '#b35900',
    gradientStartHover: '#a63700', 
    gradientEndHover: '#d97e00',
    disabled: '#aa9988',
    onPrimary: '#ebe7e4',
    onPrimaryShadow: 'rgba(24, 12, 0, 0.6)',
    onPrimaryHighlighted: '#a6d2ff',
    secondary: '#d9d5d2',
    secondaryHover: '#ccc9c6',
    background: '#fff',
    backgroundHover: '#e5e2df',
    secondaryBackground: '#f2eeeb',
    tertiaryBackground: '#e5e2df',
    headerBackground: '#d9d5d2',
    text: '#321',
    secondaryText: '#887858',
    error: '#bb1107',
    border: '#786848',
    readOnlyBorder: '#A38D62',
    imageOverlayBackground: 'rgba(255, 255, 255, 0.7)',
  },
};

export const darkTheme = {
  ...baseTheme,
  colors: {
    primary: '#e57300',
    gradientStart: '#bf4000', 
    gradientEnd: '#f28d00',
    primaryHover: '#b35900',
    gradientStartHover: '#a63700', 
    gradientEndHover: '#d97e00',
    disabled: '#5c5c5c', 
    onPrimary: '#e5e2df',
    onPrimaryShadow: 'rgba(24, 12, 0, 0.6)',
    onPrimaryHighlighted: '#a6d2ff',
    secondary: '#403e3c', 
    secondaryHover: '#2c2b2a', 
    background: '#1f1e1d', 
    backgroundHover: '#333130',
    secondaryBackground: '#0d0c0c',
    tertiaryBackground: '#292826',
    headerBackground: '#403e3c',
    text: '#e5e2df', 
    secondaryText: '#b0a589', 
    error: '#ff6659',
    border: '#807e7c', 
    readOnlyBorder: '#403F3E',
    imageOverlayBackground: 'rgba(0, 0, 0, 0.5)',
  },
};
