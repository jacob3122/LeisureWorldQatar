import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import DarkColors from '../constants/DarkColors';
import LightColors from '../constants/LightColors';
import { StatusBar } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    // console.log('useTheme ThemeProvider'+JSON.stringify(context));

    if (!context) {
      console.log('useTheme must be used within a ThemeProvider');
    }
    return context;
  };

export const ThemeProvider = ({ children }) => {
  const initialColorScheme = Appearance.getColorScheme();
  const [colorScheme, setColorScheme] = useState(initialColorScheme);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
    //   console.log('useTheme ThemeProvider'+JSON.stringify(colorScheme));

      setColorScheme(colorScheme);
  // StatusBar.setBarStyle(colorScheme === 'dark' ? 'light-content' : 'dark-content',true);

    });
    setColorScheme(initialColorScheme);
    return () => subscription.remove();
  }, []);

  const theme = (colorScheme === 'dark' ? DarkColors : LightColors);
  StatusBar.setBarStyle(colorScheme === 'dark' ? 'light-content' : 'dark-content',true);
  // StatusBar.apply();
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
