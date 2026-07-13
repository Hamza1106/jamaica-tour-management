import { createFileRoute } from "@tanstack/react-router";
import { Search, RefreshCw, Trash2, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiAllBookings, apiUpdateStatus, apiDeleteBooking } from "@/lib/api";
type BookingStatus = "pending"|"confirmed"|"completed"|"cancelled";

export const Route = createFileRoute("/admin/reservations")({ component: ReservationsPage });

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending:   "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

// Normalize booking: MongoDB uses camelCase, map to what UI expects
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
    vehicle_id:   b.vehicleId  ?? b.vehicle_id ?? "",
    scheduled_at: b.scheduledAt ?? b.scheduled_at,
    passengers:   b.passengers,
    status:       b.status,
    total_usd:    b.totalUsd   ?? b.total_usd  ?? 0,
  };
}

function ReservationsPage() {
  const [rows, setRows]       = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [q, setQ]             = useState("");
  const [status, setStatus]   = useState("all");

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await apiAllBookings();
      const raw = res.bookings ?? res;
      setRows(raw.map(normalize));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() =>
    rows.filter((r) => {
      const matchQ = !q || [r.full_name, r.id, r.email, r.tour_name ?? "", r.pickup, r.dropoff]
        .join(" ").toLowerCase().includes(q.toLowerCase());
      const matchS = status === "all" || r.status === status;
      return matchQ && matchS;
    }), [rows, q, status]);

  const handleStatus = async (id: string, s: BookingStatus) => {
    try {
      await apiUpdateStatus(id, s);
      setRows((rs) => rs.map((r) => r.id === id ? { ...r, status: s } : r));
      toast.success(`Status updated → ${s}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete this booking? This cannot be undone.`)) return;
    try {
      await apiDeleteBooking(id);
      setRows((rs) => rs.filter((r) => r.id !== id));
      toast.success("Booking deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const formatDate = (val: any) => {
    if (!val) return "—";
    const d = new Date(val);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  };

  const formatTime = (val: any) => {
    if (!val) return "";
    const d = new Date(val);
    return isNaN(d.getTime()) ? "" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatMoney = (val: any) => {
    const n = Number(val);
    return isNaN(n) ? "$0.00" : `$${n.toFixed(2)}`;
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)}
                 placeholder="Search by name, email, ID…" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {["pending","confirmed","completed","cancelled"].map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="rounded-full gap-1.5" onClick={load} disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Live
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {["ID","Customer","Type","Trip","Scheduled","Pax","Status","Total","Actions"].map((h) => (
                  <th key={h} className={`px-4 py-3 ${h === "Total" || h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && !rows.length && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-muted-foreground">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin" />
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={9} className="py-14 text-center text-muted-foreground">No reservations found.</td></tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{String(r.id).slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{r.full_name}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                    {r.phone && <div className="text-xs text-muted-foreground">{r.phone}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">{r.type}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="font-medium">{r.tour_name ?? `${r.pickup} → ${r.dropoff}`}</div>
                    <div className="text-muted-foreground">{r.vehicle_id}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {formatDate(r.scheduled_at)}<br />
                    <span className="text-muted-foreground">{formatTime(r.scheduled_at)}</span>
                  </td>
                  <td className="px-4 py-3 text-center">{r.passengers}</td>
                  <td className="px-4 py-3">
                    <Select value={r.status} onValueChange={(v) => handleStatus(r.id, v as BookingStatus)}>
                      <SelectTrigger className="h-8 w-36 border-0 text-xs p-0">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_COLORS[r.status as BookingStatus] ?? ""}`}>
                          {r.status}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {(["pending","confirmed","completed","cancelled"] as BookingStatus[]).map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-right font-bold">{formatMoney(r.total_usd)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(r.id)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length > 0 && (
          <div className="border-t border-border px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{filtered.length} of {rows.length} booking{rows.length !== 1 ? "s" : ""}</span>
            <span className="font-semibold text-foreground">
              Total: {formatMoney(filtered.reduce((s, r) => s + Number(r.total_usd || 0), 0))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}