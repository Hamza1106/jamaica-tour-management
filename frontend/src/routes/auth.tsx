import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiLogin, apiSignup } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s.redirect === "string" ? s.redirect : "/" }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { redirect } = Route.useSearch();
  const [tab, setTab]       = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm]     = useState({ fullName: "", email: "", password: "", phone: "" });

  const handle = async () => {
    setLoading(true);
    try {
      let data;
      if (tab === "login") {
        data = await apiLogin(form.email, form.password);
      } else {
        if (!form.fullName) { toast.error("Full name required"); setLoading(false); return; }
        data = await apiSignup(form.fullName, form.email, form.password, form.phone);
      }
      setUser(data.user);
      toast.success(tab === "login" ? "Welcome back!" : "Account created!");
      navigate({ to: redirect || "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 page-enter">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-elevated">
        {/* Tabs */}
        <div className="flex rounded-2xl bg-muted p-1 mb-7">
          {(["login", "signup"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 rounded-xl py-2 text-sm font-semibold capitalize transition-all duration-300 ${
                tab === t ? "bg-card shadow-soft text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}>
              {t === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {tab === "signup" && (
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full name</Label>
              <Input className="mt-1" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Hamza Qureshi" />
            </div>
          )}
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input className="mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
          </div>
          {tab === "signup" && (
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone (optional)</Label>
              <Input className="mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 876 555 0100" />
            </div>
          )}
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
            <Input className="mt-1" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handle()} />
          </div>

          <Button onClick={handle} disabled={loading}
            className="w-full rounded-full bg-gradient-sunset font-semibold text-accent-foreground shadow-gold hover:opacity-95 mt-2">
            {loading ? "Please wait…" : tab === "login" ? "Sign in" : "Create account"}
          </Button>
        </div>
      </div>
    </div>
  );
}
