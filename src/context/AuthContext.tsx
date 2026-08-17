import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Chief Editor' | 'Senior News Editor' | 'Fact Checker' | 'Newsroom Admin';
  avatarUrl?: string;
  lastLogin?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickDemoLogin: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'nigeria_daily_admin_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Simulated credential verification with default newsroom editorial credentials
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please enter both your newsroom email and access key.' };
    }

    // Accept default editorial desk access credentials or any valid newsroom domain
    if (
      cleanEmail.includes('admin') || 
      cleanEmail.includes('editor') || 
      cleanEmail.endsWith('@nigeriadaily.ng') ||
      cleanEmail === 'bamexsamuel@gmail.com' ||
      cleanPass.length >= 4
    ) {
      const adminProfile: AdminUser = {
        id: `usr-${Date.now()}`,
        name: cleanEmail === 'bamexsamuel@gmail.com' ? 'Samuel B. (Chief Editor)' : 'Editorial Desk Admin',
        email: cleanEmail,
        role: 'Chief Editor',
        lastLogin: new Date().toISOString()
      };

      setUser(adminProfile);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminProfile));
      setShowLoginModal(false);
      return { success: true };
    }

    return { 
      success: false, 
      error: 'Invalid newsroom credentials. Use the 1-Click Editorial Login or check your email.' 
    };
  };

  const quickDemoLogin = () => {
    const adminProfile: AdminUser = {
      id: 'usr-chief-editor',
      name: 'Editorial News Desk Chief',
      email: 'editor@nigeriadaily.ng',
      role: 'Chief Editor',
      lastLogin: new Date().toISOString()
    };
    setUser(adminProfile);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminProfile));
    setShowLoginModal(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        quickDemoLogin,
        showLoginModal,
        setShowLoginModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AuthProvider');
  }
  return context;
};
