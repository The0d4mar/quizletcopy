'use client'

import { createContext, useContext, useState } from 'react';

type AppContextType = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState('dark');

  return (
    <AppContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useAppContext must be used inside AppProvider'
    );
  }

  return context;
}