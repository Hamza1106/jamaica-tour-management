import { MapPin, Navigation } from "lucide-react";

/**
 * Lightweight visual map placeholder. Swap with Google Maps connector later
 * (the Google Maps Platform connector is documented in the knowledge base).
 */
export function MapPreview({
  pickup = "Montego Bay (MBJ) Airport",
  destination = "Sandals Royal Caribbean, Ocho Rios",
  distance = "108 km",
  duration = "1h 50m",
}: {
  pickup?: string;
  destination?: string;
  distance?: string;
  duration?: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <div className="relative h-64 bg-gradient-sea sm:h-80">
        {/* abstract map graphic */}
        <svg viewBox="0 0 800 400" className="absolute inset-0 h-full w-full opacity-90" preserveAspectRatio="none">
          <defs>
            <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.55 0.13 165)" />
              <stop offset="100%" stopColor="oklch(0.42 0.11 165)" />
            </linearGradient>
          </defs>
          <path d="M0,260 C140,180 250,300 400,240 C560,180 700,290 800,230 L800,400 L0,400 Z" fill="url(#land)" opacity="0.85" />
          <path
            d="M120,300 C220,260 300,200 420,210 C520,220 600,160 700,140"
            fill="none"
            stroke="oklch(0.78 0.16 75)"
            strokeWidth="4"
            strokeDasharray="2 8"
            strokeLinecap="round"
          />
          <circle cx="120" cy="300" r="10" fill="oklch(0.78 0.16 75)" />
          <circle cx="700" cy="140" r="10" fill="oklch(0.66 0.13 195)" />
          <circle cx="120" cy="300" r="18" fill="oklch(0.78 0.16 75)" opacity="0.25" />
          <circle cx="700" cy="140" r="18" fill="oklch(0.66 0.13 195)" opacity="0.25" />
        </svg>
        <div className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold backdrop-blur">
          Route preview
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <div className="rounded-full bg-card/90 px-3 py-1 text-xs font-semibold backdrop-blur">{distance}</div>
          <div className="rounded-full bg-card/90 px-3 py-1 text-xs font-semibold backdrop-blur">{duration}</div>
        </div>
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-2">
        <Stop icon={<MapPin className="h-4 w-4" />} label="Pickup" value={pickup} accent="text-accent-foreground bg-accent" />
        <Stop icon={<Navigation className="h-4 w-4" />} label="Destination" value={destination} accent="text-primary-foreground bg-primary" />
      </div>
    </div>
  );
}

function Stop({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-3">
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${accent}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}
