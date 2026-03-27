import React, { useState, useEffect } from 'react';
import { AppContext, AppContextType, User, StudentType } from './AppContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<string>('dark');
  const [user, setUser] = useState<User | null>(null);
  const [studentType, setStudentType] = useState<StudentType>('ug'); 
  const [loading, setLoading] = useState<boolean>(false);

  // Example effect
  useEffect(() => {
    console.log('App initialization...');
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value: AppContextType = {
    theme,
    setTheme,
    toggleTheme,
    user,
    setUser,
    loading,
    setLoading,
    studentType,
    setStudentType,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
