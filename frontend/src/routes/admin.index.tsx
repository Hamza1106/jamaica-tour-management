import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, DollarSign, RefreshCw, Star, TrendingUp, Users, AlertCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { apiAllBookings, apiBookingStats } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function normalize(b: any) {
  return {
    id:           b._id ?? b.id,
    full_name:    b.fullName   ?? b.full_name,
    email:        b.email,
    phone:        b.phone,
    type:         b.type,
    pickup:       b.pickup,
    dropoff:      b.dropoff,
    tour_name:    b.tourName   ?? b.tour_name  ?? null,
    scheduled_at: b.scheduledAt ?? b.scheduled_at,
    passengers:   b.passengers,
    status:       b.status,
    total_usd:    b.totalUsd   ?? b.total_usd  ?? 0,
  };
}

function AdminDashboard() {
  const { profile } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats]       = useState<any | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [allRes, s] = await Promise.all([apiAllBookings(), apiBookingStats()]);
      const raw = allRes.bookings ?? allRes;
      setBookings(raw.map(normalize));
      setStats(s);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const upcoming = bookings.filter((r) => r.status === "confirmed" || r.status === "pending").slice(0, 6);
  const maxBar   = Math.max(...(stats?.trend?.map((b: any) => b.value) ?? [1]), 1);

  const formatDate = (val: any) => {
    if (!val) return "—";
    const d = new Date(val);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  };

  const formatMoney = (val: any) => {
    const n = Number(val);
    return isNaN(n) ? "$0.00" : `$${n.toFixed(2)}`;
  };

  const statCards = [
    { label: "Bookings (mo)", value: loading ? "—" : (stats?.monthBookings ?? 0).toString(), trend: "+live", icon: CalendarCheck, color: "text-primary bg-primary/10" },
    { label: "Revenue (mo)",  value: loading ? "—" : `$${((stats?.monthRevenue ?? 0) / 1000).toFixed(1)}k`, trend: "live", icon: DollarSign, color: "text-accent-foreground bg-accent/30" },
    { label: "Pending",       value: loading ? "—" : (stats?.pending ?? 0).toString(), trend: "now", icon: Star, color: "text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30" },
    { label: "Confirmed",     value: loading ? "—" : (stats?.confirmed ?? 0).toString(), trend: "now", icon: Users, color: "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dashboard</div>
          <h1 className="text-2xl font-black">Welcome back, {profile?.full_name?.split(" ")[0] ?? "Admin"}</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Real-time
          <button onClick={load} className="ml-2 rounded-full border border-border p-1.5 hover:bg-muted transition-colors">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                <TrendingUp className="h-3 w-3" />{s.trend}
              </span>
            </div>
            <div className="mt-4 text-2xl font-black">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bookings trend chart */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Bookings this week</h2>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-3">
            {(stats?.trend ?? Array.from({ length: 7 }, (_: any, i: number) => ({ day: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][i], value: 0 }))).map((d: any) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                {d.value > 0 && (
                  <span className="text-[10px] font-bold text-muted-foreground">{d.value}</span>
                )}
                <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-accent transition-all duration-700"
                     style={{ height: `${maxBar > 0 ? (d.value / maxBar) * 100 : 0}%`, minHeight: d.value > 0 ? "8px" : "2px" }} />
                <div className="text-[10px] font-semibold uppercase text-muted-foreground">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular tours */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="text-base font-bold">Popular tours</h2>
          {loading ? (
            <div className="mt-4 space-y-3">
              {[1,2,3].map((i) => <div key={i} className="shimmer h-8 rounded-xl" />)}
            </div>
          ) : stats?.popularTours?.length ? (
            <ul className="mt-4 space-y-3">
              {stats.popularTours.map((t: any) => {
                const pct = Math.round((t.bookings / (stats.popularTours[0]?.bookings || 1)) * 100);
                return (
                  <li key={t.name}>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="truncate">{t.name}</span>
                      <span className="ml-2 shrink-0 text-muted-foreground">{t.bookings}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-accent"
                           style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-6 text-center text-sm text-muted-foreground">No tour bookings yet.</p>
          )}
        </div>
      </div>

      {/* Recent bookings */}
      <div className="rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-bold">Upcoming &amp; pending</h2>
          <Link to="/admin/reservations" className="text-xs font-semibold text-primary hover:underline">View all →</Link>
        </div>
        {loading && !bookings.length ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map((i) => <div key={i} className="shimmer h-12 rounded-xl" />)}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">No upcoming bookings.</div>
        ) : (
          <ul className="divide-y divide-border">
            {upcoming.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                  {b.passengers}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-sm">{b.full_name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {b.tour_name ?? `${b.pickup} → ${b.dropoff}`}
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold">{formatMoney(b.total_usd)}</div>
                  <div className="text-muted-foreground">{formatDate(b.scheduled_at)}</div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                  b.status === "pending"   ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                  b.status === "confirmed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""
                }`}>
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}