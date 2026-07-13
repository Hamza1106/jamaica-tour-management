import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Snowflake, Users, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VEHICLES } from "@/lib/mock-data";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Our Fleet — Irie Island Tours & Transfers" },
      { name: "description", content: "Modern, fully-insured vehicles for every party size. Sedans, SUVs, vans, and luxury chauffeured rides." },
    ],
  }),
  component: FleetPage,
});

function FleetPage() {
  return (
    <div className="page-enter">
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">Our fleet</div>
          <h1 className="mt-2 max-w-2xl text-4xl font-black sm:text-5xl">A vehicle for every kind of journey</h1>
          <p className="mt-4 max-w-xl text-primary-foreground/90">Fully insured, climate-controlled, and meticulously maintained. Pick the ride that fits your trip.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2">
        {VEHICLES.map((v) => (
          <div key={v.id} className="flex gap-5 rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-gradient-sea text-3xl">
              {v.type === "Sedan" ? "🚗" : v.type === "SUV" ? "🚙" : v.type === "Van" ? "🚐" : "🏎️"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold uppercase tracking-widest text-primary">{v.type}</div>
              <div className="text-xl font-bold">{v.name}</div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {v.seats} seats</span>
                <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {v.luggage} bags</span>
                <span className="flex items-center gap-1"><Snowflake className="h-3.5 w-3.5" /> AC</span>
                <span className="flex items-center gap-1"><Wifi className="h-3.5 w-3.5" /> WiFi</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {v.features.map((f) => (
                  <span key={f} className="rounded-full bg-muted px-2.5 py-1 text-xs">{f}</span>
                ))}
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-2xl font-black">${v.pricePerKm}<span className="text-sm font-medium text-muted-foreground">/km</span></div>
                </div>
                <Button asChild className="rounded-full bg-gradient-sunset text-accent-foreground shadow-gold">
                  <Link to="/book">Reserve</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
