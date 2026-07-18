import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Car, Plane, ShieldCheck, Star } from "lucide-react";
import { QuickBook } from "@/components/site/quick-book";
import { TourCard } from "@/components/site/tour-card";
import { TESTIMONIALS, TOURS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-reveal";
import { useDocumentHead } from "@/hooks/use-document-head";
import { useAuth } from "@/lib/auth";
import heroImg from "@/assets/hero-jamaica.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  useDocumentHead("Irie Island Tours & Transfers — Jamaica Taxi, Airport Transfers & Tours", [
    { name: "description", content: "Book trusted airport transfers and unforgettable tours across Jamaica. Dunn's River, Blue Mountains, Negril and more." },
    { property: "og:title", content: "Irie Island — Jamaica Tours & Transfers" },
    { property: "og:description", content: "Premium Jamaica taxi, airport transfers, and island tours." },
    { property: "og:image", content: "/og-home.jpg" },
  ]);
  useScrollReveal();
  const { user } = useAuth();
  const featured = TOURS.slice(0, 3);
  const bookTo = user ? "/book" : "/auth";
  const bookSearch = user ? undefined : ({ redirect: "/book" } as never);
  return (
    <div className="page-enter">
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Aerial view of a Jamaica beach with palm trees and turquoise water"
          width={1920}
          height={1080}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/30 via-secondary/40 to-background/95" />
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24 sm:pb-16 lg:pt-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-card/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Jamaica's trusted island ride
            </div>
            <h1 className="mt-5 text-balance text-4xl font-black leading-[1.05] text-primary-foreground drop-shadow sm:text-6xl lg:text-7xl">
              Your Jamaica.<br />
              <span className="text-shimmer">Your ride.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-foreground/90 drop-shadow sm:text-lg">
              Airport transfers, private chauffeurs, and unforgettable tours — booked in minutes, driven by locals you can trust.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-gradient-sunset font-semibold text-accent-foreground shadow-gold hover:opacity-95">
                <Link to={bookTo} search={bookSearch}>Book a Ride <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 font-semibold text-primary-foreground backdrop-blur hover:bg-white/20">
                <Link to="/tours">Browse Tours</Link>
              </Button>
            </div>
          </div>

          <div className="mt-10 lg:mt-16 reveal reveal-delay-2">
            <QuickBook />
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="mx-auto -mt-2 grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {[
          { icon: ShieldCheck, label: "Licensed & insured", sub: "JUTA member fleet" },
          { icon: Star, label: "4.9 / 5 average", sub: "4,200+ reviews" },
          { icon: Plane, label: "Flight tracking", sub: "Free wait on delays" },
          { icon: Award, label: "Local experts", sub: "Born & raised drivers" },
        ].map((t, i) => (
          <div key={t.label} className={`reveal reveal-delay-${(i % 4) + 1} flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft hover-lift`}>
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <t.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold">{t.label}</div>
              <div className="text-xs text-muted-foreground">{t.sub}</div>
            </div>
          </div>
        ))}
      </section>

      {/* FEATURED TOURS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Signature experiences</div>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Featured Jamaica tours</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">Handpicked island experiences with hotel pickup, local guides, and unbeatable views.</p>
          </div>
          <Button asChild variant="ghost" className="rounded-full text-primary hover:bg-primary/10">
            <Link to="/tours">View all tours <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t, i) => (
            <div key={t.slug} className={`reveal reveal-delay-${(i % 3) + 1} hover-lift`}>
              <TourCard tour={t} />
            </div>
          ))}
        </div>
      </section>

      {/* AIRPORT TRANSFER CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal grid overflow-hidden rounded-3xl border border-border bg-gradient-hero text-primary-foreground shadow-elevated md:grid-cols-2">
          <div className="p-8 sm:p-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Plane className="h-3.5 w-3.5" /> Airport transfers
            </div>
            <h3 className="mt-4 text-3xl font-black sm:text-4xl">From the tarmac to the towel — in 60 minutes flat.</h3>
            <p className="mt-3 max-w-md text-primary-foreground/90">
              Meet-and-greet at MBJ or KIN, free flight tracking, cold towel and bottled water in every vehicle. Fixed prices, zero surprises.
            </p>
            <ul className="mt-5 grid gap-2 text-sm">
              {["Free 60-min wait on international arrivals", "Child seats on request", "Cashless booking with email receipt"].map((x) => (
                <li key={x} className="flex items-center gap-2"><Car className="h-4 w-4 text-accent" /> {x}</li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-7 rounded-full bg-accent font-semibold text-accent-foreground hover:opacity-95">
              <Link to={bookTo} search={bookSearch}>Book a transfer</Link>
            </Button>
          </div>
          <div className="relative hidden md:block">
            <img src={TOURS[5].image} alt="Luxury airport transfer SUV in Jamaica" width={1024} height={768} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="reveal text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">Loved by travelers</div>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">Real stories from real guests</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <figure key={t.name} className={`reveal reveal-delay-${(i % 4) + 1} flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-soft hover-lift`}>
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-accent" />)}
              </div>
              <blockquote className="mt-3 flex-1 text-sm text-foreground/90">"{t.text}"</blockquote>
              <figcaption className="mt-4 border-t border-border pt-3 text-xs">
                <div className="font-bold text-foreground">{t.name}</div>
                <div className="text-muted-foreground">{t.location} · {t.tour}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
