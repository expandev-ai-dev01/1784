import { type ReactNode } from 'react';
import { AppContext } from './context';
import type { AppContextValue } from './types';

export interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const value: AppContextValue = {
    appName: 'Catálogo de Carros',
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
