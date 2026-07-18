import { createFileRoute, Link, Outlet, useRouterState, Navigate } from "@tanstack/react-router";
import { BarChart3, CalendarCheck, LayoutDashboard, LogOut, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useDocumentHead } from "@/hooks/use-document-head";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard",    icon: LayoutDashboard, end: true  },
  { to: "/admin/reservations", label: "Reservations", icon: CalendarCheck, end: false },
  { to: "/admin/drivers",      label: "Drivers",       icon: Users,         end: false },
  { to: "/admin/analytics",    label: "Analytics",     icon: BarChart3,     end: false },
] as const;

function AdminLayout() {
  useDocumentHead("Admin · Irie Island", [{ name: "robots", content: "noindex,nofollow" }]);
  const { user, isAdmin, loading, profile } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Still checking auth — show spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Checking permissions…</p>
        </div>
      </div>
    );
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/auth" search={{ redirect: pathname }} replace />;
  }

  // Logged in but not admin → show access denied (don't redirect to / which causes loop)
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-sm text-center space-y-4 page-enter">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold">Access denied</h1>
          <p className="text-sm text-muted-foreground">
            You can not access Admin section!
          </p>
          <p className="text-xs text-muted-foreground bg-muted rounded-xl p-3">
            
            <code className="font-mono text-primary">
              You Don't Have Admin Rights
            </code>
          </p>
          <div className="flex gap-2 justify-center">
            <Link to="/" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
              Go home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = (profile?.full_name ?? user.email ?? "A")
    .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
            <span className="font-black">I</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold">Irie Admin</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Operations</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3 space-y-1">
          <Link to="/" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
            <LogOut className="h-4 w-4" /> Back to site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Admin</div>
            <div className="text-base font-bold">
              {NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)))?.label ?? "Dashboard"}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-sunset text-[11px] font-bold text-accent-foreground">
              {initials}
            </span>
            <span className="font-semibold">{profile?.full_name ?? user.email}</span>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 md:hidden scrollbar-none">
          {NAV.map((item) => {
            const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                <item.icon className="h-3.5 w-3.5" /> {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
