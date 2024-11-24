import React, { createContext, useState } from 'react';

import { Appearance } from 'react-native';

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [bottomBar, setBottomBar] = useState(1);
  const [referralCode, setReferralCode] = useState('');
  const [openProductCode, setOpenProductCode] = useState('');
  const [pageContent, setPageContent] = useState(undefined);
  const [pageToGo, setPageToGo] = useState('');
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  return (
    <StateContext.Provider value={{ 
      bottomBar, setBottomBar,
      pageContent, setPageContent,
      colorScheme,setColorScheme,
      referralCode,setReferralCode,
      openProductCode,setOpenProductCode,
      pageToGo,setPageToGo
      }}>
      {children}
    </StateContext.Provider>
  );
};

