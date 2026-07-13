import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiMe, apiLogout } from "@/lib/api";

type User = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
};

type AuthCtx = {
  user:    User | null;
  isAdmin: boolean;
  loading: boolean;
  profile: { full_name?: string } | null;
  setUser: (u: User | null) => void;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null, isAdmin: false, loading: true,
  profile: null,
  setUser: () => {}, signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("irie_token");
    if (!token) { setLoading(false); return; }
    apiMe()
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem("irie_token"))
      .finally(() => setLoading(false));
  }, []);

  const signOut = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <Ctx.Provider value={{
      user,
      isAdmin: user?.role === "admin",
      loading,
      profile: user ? { full_name: user.fullName } : null,
      setUser,
      signOut,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);