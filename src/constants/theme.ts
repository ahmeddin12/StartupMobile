import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  // Add more font configurations as needed
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
    secondary: '#03DAC6',
    error: '#B00020',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#000000',
  },
  fonts: configureFonts({ config: fontConfig }),
}; 