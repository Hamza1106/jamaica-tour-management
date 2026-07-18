import { createFileRoute, Navigate, useNavigate, useRouterState } from "@tanstack/react-router";
import { Check, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPreview } from "@/components/site/map-preview";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { TOURS, VEHICLES, getTour } from "@/lib/mock-data";
import { apiCreateBooking } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useDocumentHead } from "@/hooks/use-document-head";
import { z } from "zod";

type BookSearch = {
  type?: "airport" | "tour" | "custom";
  pickup?: string;
  dropoff?: string;
  date?: string;
  passengers?: string;
  tour?: string;
};

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>): BookSearch => ({
    type: (s.type as BookSearch["type"]) ?? "airport",
    pickup: typeof s.pickup === "string" ? s.pickup : "",
    dropoff: typeof s.dropoff === "string" ? s.dropoff : "",
    date: typeof s.date === "string" ? s.date : "",
    passengers: typeof s.passengers === "string" ? s.passengers : "2",
    tour: typeof s.tour === "string" ? s.tour : undefined,
  }),
  component: BookPage,
});

const schema = z.object({
  fullName:   z.string().trim().min(2, "Enter your full name").max(80),
  email:      z.string().trim().email("Enter a valid email").max(255),
  phone:      z.string().trim().min(7, "Enter a valid phone").max(30),
  pickup:     z.string().trim().min(2, "Pickup required").max(120),
  dropoff:    z.string().trim().min(2, "Destination required").max(120),
  date:       z.string().min(1, "Date required"),
  passengers: z.string(),
  vehicle:    z.string(),
  notes:      z.string().max(500).optional(),
});

function BookPage() {
  useDocumentHead("Book a Ride or Tour — Irie Island", [
    { name: "description", content: "Reserve airport transfers and Jamaica tours with secure online booking." },
  ]);
  const search    = Route.useSearch();
  const navigate  = useNavigate();
  const { user, loading } = useAuth();
  const pathname  = useRouterState({ select: (s) => s.location.pathname });

  // ── Tour state — driven by URL param OR the dropdown ──────────────────────
  const [tourSlug, setTourSlug] = useState<string>(search.tour ?? "__none__");
  const selectedTour = tourSlug !== "__none__" ? getTour(tourSlug) : null;

  // keep URL in sync when user picks a tour from the dropdown
  const handleTourChange = (slug: string) => {
    setTourSlug(slug);
    const tour = slug !== "__none__" ? getTour(slug) : null;
    if (tour) {
      setForm((f) => ({ ...f, dropoff: tour.location }));
    }
    navigate({
      to: "/book",
      search: (prev) => ({ ...prev, tour: slug !== "__none__" ? slug : undefined }),
      replace: true,
    });
  };

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [vehicle, setVehicle] = useState(VEHICLES[1].id);
  const [form, setForm] = useState({
    fullName:   "",
    email:      "",
    phone:      "",
    pickup:     search.pickup ?? "",
    dropoff:    selectedTour?.location ?? search.dropoff ?? "",
    date:       search.date ?? "",
    passengers: search.passengers ?? "2",
    notes:      "",
  });

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        email:    f.email    || user.email || "",
        fullName: f.fullName || (user.user_metadata?.full_name as string) || "",
      }));
    }
  }, [user]);

  // sync dropoff when selectedTour changes via URL on first load
  useEffect(() => {
    if (selectedTour) {
      setForm((f) => ({ ...f, dropoff: f.dropoff || selectedTour.location }));
    }
  }, [selectedTour]);

  if (loading) return <div className="mx-auto max-w-md py-24 text-center text-muted-foreground">Loading…</div>;
  if (!user)   return <Navigate to="/auth" search={{ redirect: pathname }} replace />;

  const total = useMemo(() => {
    const v = VEHICLES.find((x) => x.id === vehicle)!;
    if (selectedTour) return selectedTour.priceUsd * Number(form.passengers || 1);
    return Math.round(v.pricePerKm * 80 + 35);
  }, [vehicle, selectedTour, form.passengers]);

  const next = () => {
    if (step === 1) {
      const result = schema.safeParse({ ...form, vehicle });
      if (!result.success) { toast.error(result.error.issues[0]?.message ?? "Please fix the form"); return; }
    }
    setStep((s) => ((s + 1) as 1 | 2 | 3));
  };

  const [confirming, setConfirming] = useState(false);

  const confirm = async () => {
    if (!user) return;
    setConfirming(true);
    try {
      const bookingType = selectedTour ? "tour" : (search.type ?? "airport");
      await apiCreateBooking({
        type:        bookingType,
        fullName:    form.fullName,
        email:       form.email,
        phone:       form.phone,
        pickup:      form.pickup,
        dropoff:     form.dropoff,
        scheduledAt: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
        passengers:  Number(form.passengers) || 1,
        vehicleId:   vehicle,
        tourSlug:    selectedTour?.slug ?? null,
        tourName:    selectedTour?.name ?? null,
        totalUsd:    total,
        notes:       form.notes || null,
      });
      toast.success("Booking confirmed! Confirmation sent to " + form.email);
      setStep(3);
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : "Something went wrong";
      // Give a helpful hint if the DB tables don't exist yet
      if (msg.includes("relation") || msg.includes("does not exist") || msg.includes("bookings")) {
        msg = "Database not set up yet. Run supabase/migrations.sql in your Supabase SQL editor first.";
      }
      if (msg.includes("env") || msg.includes("SUPABASE") || msg.includes("Missing")) {
        msg = "Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env file.";
      }
      toast.error(msg, { duration: 8000 });
      console.error("[Booking error]", err);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 page-enter">
      <div className="text-xs font-bold uppercase tracking-widest text-primary">Reservation</div>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">
        {selectedTour ? `Book: ${selectedTour.name}` : "Book your ride"}
      </h1>

      {/* Stepper */}
      <ol className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider">
        {["Trip details", "Payment", "Confirmed"].map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const active = step === n;
          const done   = step > n;
          return (
            <li key={label} className="flex items-center gap-2">
              <span className={`grid h-7 w-7 place-items-center rounded-full transition-all duration-300 ${
                done   ? "bg-primary text-primary-foreground scale-110" :
                active ? "bg-accent  text-accent-foreground  scale-110" :
                         "bg-muted   text-muted-foreground"
              }`}>
                {done ? <Check className="h-4 w-4" /> : n}
              </span>
              <span className={active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
              {n < 3 && <span className="h-px w-8 bg-border" />}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft"
                 style={{ animation: "slide-up 0.35s cubic-bezier(0.22,1,0.36,1) both" }}>
              <h2 className="text-lg font-bold">Trip details</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <FormField label="Full name">
                  <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                </FormField>
                <FormField label="Email">
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </FormField>
                <FormField label="Phone / WhatsApp">
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </FormField>
                <FormField label="Passengers">
                  <Select value={form.passengers} onValueChange={(v) => setForm({ ...form, passengers: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,8,12].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Pickup location">
                  <Input value={form.pickup} onChange={(e) => setForm({ ...form, pickup: e.target.value })} placeholder="MBJ Airport" />
                </FormField>
                <FormField label={selectedTour ? "Destination" : "Drop-off location"}>
                  <Input value={form.dropoff} onChange={(e) => setForm({ ...form, dropoff: e.target.value })} placeholder="Sandals Royal Caribbean" />
                </FormField>
                <FormField label="Date & time">
                  <Input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </FormField>

                {/* ── Tour dropdown — FIXED ── */}
                <FormField label="Tour package (optional)">
                  <Select value={tourSlug} onValueChange={handleTourChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tour…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No tour — transfer only</SelectItem>
                      {TOURS.map((t) => (
                        <SelectItem key={t.slug} value={t.slug}>
                          {t.name} — ${t.priceUsd}/person
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* Vehicle selector */}
              <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-muted-foreground">Vehicle</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {VEHICLES.map((v) => (
                  <button
                    type="button"
                    key={v.id}
                    onClick={() => setVehicle(v.id)}
                    className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                      vehicle === v.id
                        ? "border-primary bg-primary/5 shadow-soft scale-[1.02]"
                        : "border-border bg-card hover:border-primary/40 hover:scale-[1.01]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold uppercase tracking-wider text-primary">{v.type}</div>
                      <div className="text-sm font-bold">${v.pricePerKm}/km</div>
                    </div>
                    <div className="mt-1 font-semibold">{v.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{v.seats} seats · {v.luggage} bags</div>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notes for your driver</Label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Flight number, child seat, dietary needs…"
                  className="mt-1 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft"
                 style={{ animation: "slide-up 0.35s cubic-bezier(0.22,1,0.36,1) both" }}>
              <h2 className="text-lg font-bold flex items-center gap-2"><CreditCard className="h-5 w-5" />Payment</h2>
              <p className="mt-2 text-sm text-muted-foreground">Secure checkout — your card is encrypted end-to-end.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <FormField label="Cardholder name"><Input placeholder="Name on card" defaultValue={form.fullName} /></FormField>
                <FormField label="Card number"><Input placeholder="4242 4242 4242 4242" /></FormField>
                <FormField label="Expiry"><Input placeholder="MM / YY" /></FormField>
                <FormField label="CVC"><Input placeholder="123" /></FormField>
              </div>
              <div className="mt-6 flex items-center gap-2 rounded-2xl bg-muted/60 p-3 text-xs text-muted-foreground">
                <Lock className="h-4 w-4" /> PCI-DSS compliant · 256-bit TLS · No card data stored on our servers.
              </div>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft"
                 style={{ animation: "pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground
                              shadow-soft" style={{ animation: "pop-in 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                <Check className="h-10 w-10" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">Booking confirmed!</h2>
              <p className="mt-2 text-muted-foreground">
                A confirmation is on its way to <strong>{form.email}</strong>. Your driver will reach out 24h before pickup.
              </p>
              <div className="mx-auto mt-6 grid max-w-md gap-3 text-left text-sm">
                <Row k="Reservation #" v={"RES-" + Math.floor(10000 + Math.random() * 89999)} />
                <Row k="Pickup"  v={`${form.pickup} → ${form.dropoff}`} />
                <Row k="When"    v={form.date || "TBD"} />
                <Row k="Vehicle" v={VEHICLES.find((v) => v.id === vehicle)?.name ?? ""} />
                {selectedTour && <Row k="Tour" v={selectedTour.name} />}
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex flex-wrap gap-3">
            {step > 1 && step < 3 && (
              <Button variant="outline" className="rounded-full" onClick={() => setStep((s) => ((s - 1) as 1 | 2 | 3))}>Back</Button>
            )}
            {step === 1 && (
              <Button className="rounded-full bg-gradient-sunset font-semibold text-accent-foreground shadow-gold hover:scale-[1.02] transition-transform" onClick={next}>
                Continue to payment
              </Button>
            )}
            {step === 2 && (
              <Button disabled={confirming} className="rounded-full bg-primary font-semibold shadow-soft hover:scale-[1.02] transition-transform" onClick={confirm}>
                <Lock className="mr-1 h-4 w-4" /> {confirming ? "Processing…" : `Pay $${total} & confirm`}
              </Button>
            )}
          </div>
        </div>

        {/* ── Summary sidebar ── */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          {selectedTour && (
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
                 style={{ animation: "slide-up 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
              <img src={selectedTour.image} alt={selectedTour.name} width={1024} height={768} loading="lazy"
                   className="aspect-[16/9] w-full object-cover" />
              <div className="p-5">
                <div className="text-xs text-muted-foreground">{selectedTour.location}</div>
                <div className="mt-1 font-bold">{selectedTour.name}</div>
                <div className="mt-1 text-sm font-semibold text-primary">${selectedTour.priceUsd} × {form.passengers} person{Number(form.passengers) > 1 ? "s" : ""}</div>
              </div>
            </div>
          )}

          <MapPreview pickup={form.pickup || "Pickup location"} destination={form.dropoff || "Destination"} />

          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order summary</div>
            <dl className="mt-3 space-y-2 text-sm">
              <Line k="Vehicle"    v={VEHICLES.find((v) => v.id === vehicle)?.name ?? ""} />
              <Line k="Passengers" v={form.passengers} />
              {selectedTour
                ? <Line k="Tour" v={selectedTour.name} />
                : <Line k="Estimated distance" v="~80 km" />}
              <div className="my-3 h-px bg-border" />
              <Line k="Total (USD)" v={`$${total}`} strong />
            </dl>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Free cancellation up to 24h before pickup
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
function Line({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={strong ? "text-base font-black" : "font-medium"}>{v}</dd>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
