import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type User = { name: string; email: string; phone?: string };

type PendingAction = { label: string; run: () => void } | null;

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (u: User & { password: string }) => Promise<void>;
  logout: () => void;
  requireAuth: (label: string, run: () => void) => void;
  pending: PendingAction;
  clearPending: () => void;
  authOpen: boolean;
  setAuthOpen: (v: boolean) => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pending, setPending] = useState<PendingAction>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hotel_user");
      if (raw) setUser(JSON.parse(raw));
    } catch { }
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem("hotel_user", JSON.stringify(u));
      else localStorage.removeItem("hotel_user");
    } catch { }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("https://hotel-backend.runasp.net/api/Auth/client/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Invalid email or password.");
    }
    const data = await res.json();
    persist(data.client);
    setAuthOpen(false);
    if (pending) {
      const run = pending.run;
      setPending(null);
      setTimeout(run, 200);
    }
  };

  const signup = async (u: User & { password: string }) => {
    const res = await fetch("https://hotel-backend.runasp.net/api/Auth/client/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: u.name, email: u.email, phone: u.phone, password: u.password }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to register.");
    }
    const data = await res.json();
    persist(data.client);
    setAuthOpen(false);
    if (pending) {
      const run = pending.run;
      setPending(null);
      setTimeout(run, 200);
    }
  };

  const logout = () => persist(null);

  const requireAuth = useCallback((label: string, run: () => void) => {
    if (user) { run(); return; }
    setPending({ label, run });
    setAuthOpen(true);
  }, [user]);

  return (
    <Ctx.Provider value={{ user, login, signup, logout, requireAuth, pending, clearPending: () => setPending(null), authOpen, setAuthOpen }}>
      {children}
    </Ctx.Provider>
  );
}
export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
};
