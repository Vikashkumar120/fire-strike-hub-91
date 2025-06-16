
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: Omit<User, 'id' | 'joinedAt'>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('fireUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: Omit<User, 'id' | 'joinedAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      joinedAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('fireUser', JSON.stringify(newUser));
    
    // Store user activity for admin
    const userActivity = JSON.parse(localStorage.getItem('userActivity') || '[]');
    userActivity.push({
      ...newUser,
      action: 'login',
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('userActivity', JSON.stringify(userActivity));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fireUser');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
