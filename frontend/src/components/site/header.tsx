import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, Phone, User, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/tours", label: "Tours" },
  { to: "/fleet", label: "Fleet" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const initial = (user?.user_metadata?.full_name || user?.email || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
            <span className="text-base font-black">I</span>
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-sm font-bold tracking-tight">Irie Island</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Tours & Transfers</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a href="tel:+18765550100" className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary">
            <Phone className="h-4 w-4" />
            +1 876 555 0100
          </a>

          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-soft hover:opacity-90">
                    {initial}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button asChild className="rounded-full bg-gradient-sunset font-semibold text-accent-foreground shadow-gold hover:opacity-95">
                <Link to="/book">Book Now</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/auth" search={{ redirect: pathname }}>
                  <User className="mr-1 h-4 w-4" /> Sign in
                </Link>
              </Button>
              <Button asChild className="rounded-full bg-gradient-sunset font-semibold text-accent-foreground shadow-gold hover:opacity-95">
                <Link to="/auth" search={{ redirect: "/book" }}>Book Now</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="rounded-md p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Button asChild className="mt-3 rounded-full bg-gradient-sunset text-accent-foreground" onClick={() => setOpen(false)}>
                  <Link to="/book">Book Now</Link>
                </Button>
                <Button variant="outline" className="mt-2 rounded-full" onClick={() => { setOpen(false); handleSignOut(); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="mt-3 rounded-full" onClick={() => setOpen(false)}>
                  <Link to="/auth" search={{ redirect: pathname }}>Sign in</Link>
                </Button>
                <Button asChild className="mt-2 rounded-full bg-gradient-sunset text-accent-foreground" onClick={() => setOpen(false)}>
                  <Link to="/auth" search={{ redirect: "/book" }}>Book Now</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
