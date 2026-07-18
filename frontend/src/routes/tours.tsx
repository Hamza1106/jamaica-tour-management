import { createFileRoute } from "@tanstack/react-router";
import { TOURS } from "@/lib/mock-data";
import { useScrollReveal } from "@/hooks/use-reveal";
import { useDocumentHead } from "@/hooks/use-document-head";
import { useState, useEffect, useRef } from "react";
import { MapPin, Clock, Star, ArrowRight, Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/tours")({
  component: ToursPage,
});

const FILTERS = ["All", "Waterfall", "Beach", "Coffee", "Sunset", "Private"] as const;
type Filter = (typeof FILTERS)[number];

const TAG_MAP: Record<string, Filter[]> = {
  "dunns-river-falls":     ["Waterfall"],
  "blue-mountains-coffee": ["Coffee"],
  "ys-falls-zipline":      ["Waterfall"],
  "negril-seven-mile":     ["Beach"],
  "ricks-cafe-sunset":     ["Sunset"],
  "private-island-tour":   ["Private"],
};

function ToursPage() {
  useDocumentHead("Jamaica Tours & Excursions — Irie Island", [
    { name: "description", content: "Browse signature Jamaica tours: Dunn's River Falls, Blue Mountains coffee, YS Falls, Negril sunset, and more." },
  ]);
  useScrollReveal();
  const [active, setActive] = useState<Filter>("All");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = TOURS.filter((t) =>
    active === "All" ? true : TAG_MAP[t.slug]?.includes(active)
  );

  const selectedTour = TOURS.find((t) => t.slug === selected);
  const gridRef = useRef<HTMLDivElement>(null);

  // Re-trigger reveal animations every time the filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll<HTMLElement>(".reveal");
      cards.forEach((el) => el.classList.remove("is-visible"));
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08 }
      );
      cards.forEach((el) => io.observe(el));
    }, 30);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="text-xs font-bold uppercase tracking-widest text-accent reveal">Explore Jamaica</div>
          <h1 className="mt-2 max-w-2xl text-4xl font-black sm:text-5xl reveal reveal-delay-1">
            Tours & experiences for every kind of traveler
          </h1>
          <p className="mt-4 max-w-xl text-primary-foreground/90 reveal reveal-delay-2">
            From waterfalls and rainforests to sunset cliffs and coffee plantations — hotel pickup included.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 reveal reveal-delay-3">
            {[
              { icon: Star,  label: "4.9 avg rating" },
              { icon: MapPin, label: "6 destinations" },
              { icon: Clock, label: "5–10 hr experiences" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm font-semibold text-primary-foreground/90">
                <s.icon className="h-4 w-4 text-accent" />{s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 scrollbar-none">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                active === f
                  ? "bg-primary text-primary-foreground shadow-soft scale-[1.05]"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:scale-[1.02]"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-xs font-medium text-muted-foreground">
            {filtered.length} tour{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Tour grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">No tours match this filter.</div>
        ) : (
          <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t, i) => (
              <div
                key={t.slug}
                className={`reveal reveal-delay-${(i % 3) + 1} cursor-pointer`}
                onClick={() => setSelected(t.slug)}
              >
                {/* Card */}
                <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft
                                transition-all duration-500 hover:-translate-y-2 hover:shadow-elevated hover:border-primary/30 h-full">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={t.image} alt={t.name} loading="lazy" width={1024} height={768}
                         className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                                    opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute right-3 top-3 rounded-full bg-card/95 px-3 py-1 text-sm font-bold backdrop-blur shadow-soft">
                      ${t.priceUsd}<span className="ml-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">/person</span>
                    </div>
                    {t.available && (
                      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-palm/90 px-3 py-1
                                      text-[11px] font-semibold uppercase tracking-wider text-secondary-foreground backdrop-blur">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Available
                      </div>
                    )}
                    {/* Hover overlay CTA */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-4
                                    opacity-0 translate-y-3 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
                      <span className="flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-sm font-bold text-accent-foreground shadow-gold">
                        Quick view <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />{t.location}
                        <span>•</span>
                        <Clock className="h-3 w-3" />{t.durationHours}h
                      </div>
                      <h3 className="mt-2 text-lg font-bold leading-snug">{t.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{t.tagline}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {t.highlights.slice(0, 2).map((h) => (
                        <span key={h} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">{h}</span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-semibold">{t.rating}</span>
                        <span className="text-muted-foreground">({t.reviewCount.toLocaleString()})</span>
                      </div>
                      <span className="flex items-center gap-1 font-semibold text-primary
                                       transition-transform duration-300 group-hover:translate-x-1">
                        View <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Detail modal / drawer ────────────────────────────────────── */}
      {selectedTour && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            style={{ animation: "fade-in 0.2s ease both" }}
            onClick={() => setSelected(null)}
          />

          {/* Panel */}
          <div
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-3xl
                        bg-card shadow-elevated sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2
                        sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto sm:w-full sm:max-w-2xl
                        sm:rounded-3xl sm:max-h-[85vh]"
            style={{ animation: "slide-up 0.35s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
              <img src={selectedTour.image} alt={selectedTour.name} width={1200} height={675}
                   className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full
                           bg-black/50 text-white backdrop-blur hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Bottom of image */}
              <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-card/90 px-3 py-1 text-foreground backdrop-blur">
                    <MapPin className="mr-1 inline h-3 w-3" />{selectedTour.location}
                  </span>
                  <span className="rounded-full bg-card/90 px-3 py-1 text-foreground backdrop-blur">
                    <Clock className="mr-1 inline h-3 w-3" />{selectedTour.durationHours}h
                  </span>
                  <span className="rounded-full bg-accent px-3 py-1 text-accent-foreground">
                    <Star className="mr-1 inline h-3 w-3 fill-current" />{selectedTour.rating}
                  </span>
                </div>
                <h2 className="mt-2 text-2xl font-black text-white">{selectedTour.name}</h2>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <p className="text-sm leading-relaxed text-foreground/80">{selectedTour.description}</p>

              {/* Highlights */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary mb-3">What's included</div>
                <ul className="grid grid-cols-2 gap-2">
                  {selectedTour.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/10 p-3 text-xs">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Itinerary */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Schedule</div>
                <ol className="space-y-2">
                  {selectedTour.itinerary.map((step, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span className="grid h-12 w-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                        {step.time}
                      </span>
                      <span className="text-foreground/80">{step.stop}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Price + CTA */}
              <div className="flex items-center justify-between rounded-2xl bg-muted/60 p-4">
                <div>
                  <div className="text-xs text-muted-foreground">From</div>
                  <div className="text-2xl font-black">${selectedTour.priceUsd}
                    <span className="text-sm font-normal text-muted-foreground">/person</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="rounded-full text-sm" onClick={() => setSelected(null)}>
                    <Link to="/tours/$slug" params={{ slug: selectedTour.slug }}>Full details</Link>
                  </Button>
                  <Button asChild className="rounded-full bg-gradient-sunset font-semibold text-accent-foreground shadow-gold text-sm">
                    <Link to="/book" search={{ type: "tour", tour: selectedTour.slug } as never}>
                      Book now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
