'use client'

import { createContext, useContext, useState } from 'react';
import { AppContextType, ChildrenProps } from '@/types/types.type';


const AppContext = createContext<AppContextType | null>(null);

const AppProvider = ({
  children,
}: ChildrenProps) => {
  const [theme, setTheme] = useState('dark');

  return (
    <AppContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useAppContext must be used inside AppProvider'
    );
  }

  return context;
};

export { AppProvider, useAppContext };
