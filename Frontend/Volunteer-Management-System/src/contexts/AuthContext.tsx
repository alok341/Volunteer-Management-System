import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getProfile } from "@/services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'VOLUNTEER';  // Fixed: specific roles
  emailVerified?: boolean;        // Fixed: matches backend field name
  impactScore?: number;
  totalHours?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      // Map backend response to your User interface
      const userData: User = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        emailVerified: res.data.emailVerified, // matches backend
        impactScore: res.data.impactScore,
        totalHours: res.data.totalHours
      };
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAdmin: user?.role === "ADMIN"
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};