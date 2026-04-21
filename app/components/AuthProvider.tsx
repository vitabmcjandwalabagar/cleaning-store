"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

type AuthContextType = {
  user: any;
  authReady: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);

  const refreshUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("getUser error:", error.message);
      setUser(null);
      return;
    }

    setUser(data.user || null);
  };

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setAuthReady(true);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      await refreshUser();
      setAuthReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}