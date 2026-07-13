import { supabase } from "@/integrations/supabase/client";
import type { BookingInsert, BookingRow, BookingStatus } from "@/integrations/supabase/types";

// ── CREATE ────────────────────────────────────────────────────────────────────
export async function createBooking(data: BookingInsert): Promise<BookingRow> {
  const { data: row, error } = await supabase
    .from("bookings")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return row;
}

// ── READ — own bookings (user) ────────────────────────────────────────────────
export async function getMyBookings(): Promise<BookingRow[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── READ — all bookings (admin) ───────────────────────────────────────────────
export async function getAllBookings(): Promise<BookingRow[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, profiles:user_id(full_name, phone, role)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── UPDATE status (admin) ─────────────────────────────────────────────────────
export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

// ── CANCEL own booking (user) ─────────────────────────────────────────────────
export async function cancelMyBooking(id: string): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", id);
  if (error) throw error;
}

// ── DELETE (admin only) ───────────────────────────────────────────────────────
export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw error;
}

// ── ANALYTICS (admin) ─────────────────────────────────────────────────────────
export async function getBookingStats() {
  const { data, error } = await supabase
    .from("bookings")
    .select("total_usd, status, tour_name, created_at, scheduled_at");
  if (error) throw error;
  const rows = data ?? [];

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const thisMonth = rows.filter((r) => r.created_at >= monthStart);

  const totalBookings  = thisMonth.length;
  const monthRevenue   = thisMonth.filter((r) => r.status !== "cancelled").reduce((s, r) => s + Number(r.total_usd), 0);
  const pendingCount   = rows.filter((r) => r.status === "pending").length;
  const confirmedCount = rows.filter((r) => r.status === "confirmed").length;

  // Bookings per day (last 7 days)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const trend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toISOString().slice(0, 10);
    return {
      day: days[d.getDay()],
      value: rows.filter((r) => r.created_at.slice(0, 10) === dayStr).length,
    };
  });

  // Popular tours
  const tourCounts: Record<string, number> = {};
  rows.forEach((r) => {
    if (r.tour_name) tourCounts[r.tour_name] = (tourCounts[r.tour_name] ?? 0) + 1;
  });
  const popularTours = Object.entries(tourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, bookings]) => ({ name, bookings }));

  return { totalBookings, monthRevenue, pendingCount, confirmedCount, trend, popularTours };
}

// ── REALTIME subscription ─────────────────────────────────────────────────────
export function subscribeToBookings(callback: (payload: {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: BookingRow | null;
  old: Partial<BookingRow> | null;
}) => void) {
  const channel = supabase
    .channel("bookings-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookings" },
      (payload) => {
        callback({
          eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
          new: (payload.new as BookingRow) || null,
          old: (payload.old as Partial<BookingRow>) || null,
        });
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
