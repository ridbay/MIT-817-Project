import { createContext, Dispatch, SetStateAction } from 'react';

export type StudentType = 'ug' | 'pg';

export interface User {
  id?: string;
  name: string;
  email?: string;
  role: 'student' | 'admin';
  matric?: string;
  programme?: string;
  level?: string;
}

export interface AppContextType {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
  toggleTheme: () => void;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  studentType: StudentType;
  setStudentType: Dispatch<SetStateAction<StudentType>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
