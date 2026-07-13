import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { apiBookingStats, apiAllBookings } from "@/lib/api";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });

function normalize(b: any) {
  return {
    type:      b.type,
    status:    b.status,
    total_usd: b.totalUsd ?? b.total_usd ?? 0,
  };
}

function AnalyticsPage() {
  const [stats, setStats]       = useState<any | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [s, allRes] = await Promise.all([apiBookingStats(), apiAllBookings()]);
      const raw = allRes.bookings ?? allRes;
      setStats(s);
      setBookings(raw.map(normalize));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load analytics");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const maxBar = Math.max(...(stats?.trend?.map((b: any) => b.value) ?? [1]), 1);
  const topMax = stats?.popularTours?.[0]?.bookings || 1;

  // Revenue by type — use normalized bookings (totalUsd already mapped)
  const revenueByType = (["tour","airport","custom"] as string[]).map((type) => ({
    type,
    revenue: bookings
      .filter((r) => r.type === type && r.status !== "cancelled")
      .reduce((s, r) => s + Number(r.total_usd || 0), 0),
  }));

  const allRevenue = bookings
    .filter((r) => r.status !== "cancelled")
    .reduce((s, r) => s + Number(r.total_usd || 0), 0);

  const totalRev = allRevenue || 1; // avoid divide-by-zero for percentages

  // Status breakdown
  const statusBreakdown = (["pending","confirmed","completed","cancelled"] as string[]).map((s) => ({
    label: s,
    count: bookings.filter((r) => r.status === s).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Analytics</h1>
        <button onClick={load} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Revenue (mo)",    v: `$${((stats?.monthRevenue ?? 0) / 1000).toFixed(1)}k` },
          { label: "Bookings (mo)",   v: (stats?.monthBookings ?? 0).toString() },
          { label: "All-time revenue",v: `$${(allRevenue / 1000).toFixed(1)}k` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-3xl font-black">{loading ? "—" : s.v}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly trend */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-base font-bold">Bookings — last 7 days</h2>
          <div className="mt-6 flex h-56 items-end gap-3">
            {(stats?.trend ?? Array.from({ length: 7 }, (_: any, i: number) => ({ day: "—", value: 0 }))).map((d: any) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                {d.value > 0 && <span className="text-[10px] font-bold">{d.value}</span>}
                <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-accent"
                     style={{ height: `${(d.value / maxBar) * 100}%`, minHeight: d.value > 0 ? "8px" : "2px" }} />
                <div className="text-[10px] font-semibold uppercase text-muted-foreground">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by type */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-base font-bold">Revenue by type</h2>
          <ul className="mt-5 space-y-4">
            {revenueByType.map(({ type, revenue }) => {
              const pct = allRevenue > 0 ? (revenue / allRevenue) * 100 : 0;
              return (
                <li key={type}>
                  <div className="flex items-center justify-between text-sm font-semibold capitalize mb-1">
                    <span>{type === "airport" ? "Airport transfer" : type}</span>
                    <span>${revenue.toFixed(0)}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted">
                    <div className="h-2.5 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                         style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{pct.toFixed(1)}% of total</div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Popular tours */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-base font-bold">Popular tours</h2>
          {loading ? (
            <div className="mt-4 space-y-3">{[1,2,3].map((i) => <div key={i} className="shimmer h-9 rounded-xl" />)}</div>
          ) : stats?.popularTours?.length ? (
            <ul className="mt-4 space-y-4">
              {stats.popularTours.map((t: any) => (
                <li key={t.name}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="truncate">{t.name}</span>
                    <span className="ml-2 shrink-0 text-muted-foreground">{t.bookings} bookings</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-gradient-to-r from-primary to-accent"
                         style={{ width: `${(t.bookings / topMax) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-center text-sm text-muted-foreground">No tour data yet.</p>
          )}
        </div>

        {/* Status breakdown */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-base font-bold">Status breakdown</h2>
          <ul className="mt-5 space-y-3">
            {statusBreakdown.map(({ label, count }) => {
              const pct = bookings.length ? Math.round((count / bookings.length) * 100) : 0;
              const colors: Record<string, string> = {
                pending:   "from-amber-400 to-amber-500",
                confirmed: "from-green-400 to-green-600",
                completed: "from-blue-400 to-blue-600",
                cancelled: "from-red-400 to-red-500",
              };
              return (
                <li key={label}>
                  <div className="flex items-center justify-between text-sm font-semibold capitalize mb-1">
                    <span>{label}</span>
                    <span className="text-muted-foreground">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className={`h-2 rounded-full bg-gradient-to-r ${colors[label]}`}
                         style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}