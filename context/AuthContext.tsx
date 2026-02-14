import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('payhero_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('payhero_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('payhero_user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check if user exists in "database" (localStorage)
        const users = JSON.parse(localStorage.getItem('payhero_users') || '[]');
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        
        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };

  const signup = async (name: string, email: string, phone: string, password: string, role: UserRole) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('payhero_users') || '[]');
        const existingUser = users.find((u: any) => u.email === email);
        
        if (existingUser) {
          reject(new Error('User with this email already exists'));
          return;
        }

        // Create new user
        const newUser: User & { password: string } = {
          id: `user-${Date.now()}`,
          name,
          email,
          phone,
          role,
          password,
          createdAt: new Date(),
          totalTransactions: 0,
          totalAmountSpent: role === UserRole.BUYER ? 0 : undefined,
          totalAmountEarned: role === UserRole.FARMER ? 0 : undefined,
          totalQuantitySold: role === UserRole.FARMER ? 0 : undefined,
          totalQuantityBought: role === UserRole.BUYER ? 0 : undefined,
          orders: [],
          listings: role === UserRole.FARMER ? [] : undefined,
        };

        // Save to "database"
        users.push(newUser);
        localStorage.setItem('payhero_users', JSON.stringify(users));

        // Set current user (without password)
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserStats = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    // Update in "database" too
    const users = JSON.parse(localStorage.getItem('payhero_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('payhero_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUserStats }}>
      {children}
    </AuthContext.Provider>
  );
};
