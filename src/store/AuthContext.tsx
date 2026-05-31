import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "../types";
import { api, setAuthToken } from "../api/client";
import { KEYS, load, remove, save } from "../storage/persist";

interface AuthStore {
  session: Session | null;
  hydrating: boolean; // açılışta depolama okunurken
  pending: boolean; // giriş isteği sürerken
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthStore | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrating, setHydrating] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Açılışta kalıcı oturumu geri yükle → uygulama girişli açılır.
  useEffect(() => {
    (async () => {
      const saved = await load<Session>(KEYS.session);
      if (saved) {
        setSession(saved);
        setAuthToken(saved.token);
      }
      setHydrating(false);
    })();
  }, []);

  async function login(email: string, password: string) {
    setPending(true);
    setError(null);
    try {
      const s = await api.login(email, password);
      setSession(s);
      setAuthToken(s.token);
      await save(KEYS.session, s);
    } catch (e: any) {
      setError(e?.message ?? "Giriş başarısız.");
    } finally {
      setPending(false);
    }
  }

  async function logout() {
    setSession(null);
    setAuthToken(null);
    await remove(KEYS.session);
  }

  return (
    <AuthContext.Provider
      value={{ session, hydrating, pending, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthStore {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider içinde kullanılmalıdır.");
  return ctx;
}
