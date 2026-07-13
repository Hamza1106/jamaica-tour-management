import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Clock, MapPin, Star, Users, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPreview } from "@/components/site/map-preview";
import { getTour, TOURS, type Tour } from "@/lib/mock-data";
import { useScrollReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/tours/$slug")({
  loader: ({ params }): { tour: Tour } => {
    const tour = getTour(params.slug);
    if (!tour) throw notFound();
    return { tour };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.tour.name} — Irie Island Tours` },
          { name: "description", content: loaderData.tour.tagline },
          { property: "og:title", content: loaderData.tour.name },
          { property: "og:description", content: loaderData.tour.tagline },
          { property: "og:image", content: loaderData.tour.image },
        ]
      : [],
  }),
  component: TourDetail,
});

function TourDetail() {
  useScrollReveal();
  const { tour } = Route.useLoaderData() as { tour: Tour };
  const similar = TOURS.filter((t) => t.slug !== tour.slug).slice(0, 3);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "What's included in the price?", a: `Hotel pickup & drop-off, ${tour.highlights.join(", ")}.` },
    { q: "How many people can join?", a: "Up to 6 guests per vehicle. Larger groups? Just contact us for a custom van." },
    { q: "What if I need to cancel?", a: "Free cancellation up to 24 hours before your tour. After that, 50% refund applies." },
    { q: "Is this suitable for children?", a: "Yes — all our tours are family-friendly. Child seats available on request at no extra charge." },
  ];

  return (
    <article className="page-enter">
      {/* Hero image */}
      <div className="relative h-[60vh] min-h-80 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.name}
          width={1920}
          height={1080}
          onLoad={() => setImgLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
            imgLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
        />
        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Back button */}
        <div className="absolute left-4 top-6 sm:left-6">
          <Link
            to="/tours"
            className="flex items-center gap-2 rounded-full bg-card/80 px-4 py-2 text-sm font-semibold
                       backdrop-blur shadow-soft hover:bg-card transition-all duration-200 hover:-translate-x-0.5"
          >
            <ArrowLeft className="h-4 w-4" /> All tours
          </Link>
        </div>

        {/* Bottom info */}
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-card/90 px-3 py-1 text-foreground backdrop-blur">
              <MapPin className="mr-1 inline h-3 w-3" />{tour.location}
            </span>
            <span className="rounded-full bg-card/90 px-3 py-1 text-foreground backdrop-blur">
              <Clock className="mr-1 inline h-3 w-3" />{tour.durationHours}h experience
            </span>
            <span className="rounded-full bg-accent px-3 py-1 text-accent-foreground">
              <Star className="mr-1 inline h-3 w-3 fill-current" />{tour.rating} ({tour.reviewCount.toLocaleString()} reviews)
            </span>
          </div>
          <h1 className="mt-3 max-w-3xl text-4xl font-black text-primary-foreground drop-shadow sm:text-5xl">
            {tour.name}
          </h1>
          <p className="mt-2 text-lg text-primary-foreground/90 drop-shadow">{tour.tagline}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px]">
        {/* Left column */}
        <div className="space-y-12">

          {/* Overview */}
          <section className="reveal">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Overview</div>
            <h2 className="mt-2 text-2xl font-bold">About this tour</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/80">{tour.description}</p>
          </section>

          {/* Highlights */}
          <section className="reveal">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">What's included</div>
            <h2 className="mt-2 text-2xl font-bold">Everything covered</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {tour.highlights.map((h, i) => (
                <li
                  key={h}
                  className={`flex items-start gap-3 rounded-2xl bg-primary/5 border border-primary/10 p-4 text-sm
                              reveal reveal-delay-${(i % 4) + 1}`}
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </section>

          {/* Itinerary */}
          <section className="reveal">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Schedule</div>
            <h2 className="mt-2 text-2xl font-bold">Your day, step by step</h2>
            <ol className="mt-5 relative space-y-0">
              {/* Vertical line */}
              <div className="absolute left-[27px] top-5 bottom-5 w-0.5 bg-border" />
              {tour.itinerary.map((step, i) => (
                <li
                  key={step.time}
                  className={`relative flex items-start gap-4 pb-6 last:pb-0 reveal reveal-delay-${(i % 4) + 1}`}
                >
                  {/* Circle dot */}
                  <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl
                                  bg-primary text-primary-foreground text-xs font-bold shadow-soft">
                    {step.time}
                  </div>
                  <div className="min-w-0 rounded-2xl border border-border bg-card p-4 flex-1 shadow-soft">
                    <div className="font-semibold text-sm">{step.stop}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Map */}
          <section className="reveal">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Location</div>
            <h2 className="mt-2 text-2xl font-bold">Where you'll go</h2>
            <div className="mt-4">
              <MapPreview
                pickup="Your hotel"
                destination={tour.location}
                duration={`${tour.durationHours}h round-trip`}
                distance="—"
              />
            </div>
          </section>

          {/* FAQ */}
          <section className="reveal">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</div>
            <h2 className="mt-2 text-2xl font-bold">Common questions</h2>
            <div className="mt-5 space-y-2">
              {faqs.map((faq, i) => (
                <div key={faq.q} className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold
                               hover:bg-muted/40 transition-colors duration-200"
                  >
                    {faq.q}
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="px-5 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky booking card */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-elevated">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">${tour.priceUsd}</span>
              <span className="text-sm text-muted-foreground">/ person</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold">{tour.rating}</span>
              <span className="text-muted-foreground">({tour.reviewCount.toLocaleString()} reviews)</span>
            </div>

            <div className="my-5 h-px bg-border" />

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Clock className="h-4 w-4" />
                </span>
                {tour.durationHours} hours total
              </li>
              <li className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Users className="h-4 w-4" />
                </span>
                Up to 6 guests per vehicle
              </li>
              <li className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-4 w-4" />
                </span>
                Hotel pickup & drop-off
              </li>
            </ul>

            <Button
              asChild
              size="lg"
              className="mt-6 w-full rounded-full bg-gradient-sunset font-semibold text-accent-foreground
                         shadow-gold hover:opacity-95 hover:scale-[1.02] transition-all duration-300"
            >
              <Link to="/book" search={{ type: "tour", tour: tour.slug } as never}>
                Book this tour — ${tour.priceUsd}/person
              </Link>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Free cancellation up to 24h before
            </p>
          </div>

          {/* Social proof mini */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Travelers love this
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["R", "J", "A", "S"].map((l) => (
                  <div key={l} className="grid h-8 w-8 place-items-center rounded-full border-2 border-card
                                          bg-gradient-hero text-[11px] font-bold text-primary-foreground">
                    {l}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold">{tour.reviewCount.toLocaleString()}+ guests</span>
                <span className="text-muted-foreground"> loved this tour</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Similar tours */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 border-t border-border">
        <div className="reveal">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">Keep exploring</div>
          <h2 className="mt-2 text-2xl font-bold">You might also like</h2>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((t, i) => (
            <Link
              key={t.slug}
              to="/tours/$slug"
              params={{ slug: t.slug }}
              className={`group overflow-hidden rounded-3xl border border-border bg-card shadow-soft
                          hover:-translate-y-1 hover:shadow-elevated transition-all duration-500
                          reveal reveal-delay-${i + 1}`}
            >
              <img
                src={t.image}
                alt={t.name}
                width={1024}
                height={768}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="p-4">
                <div className="text-xs text-muted-foreground">{t.location} · {t.durationHours}h</div>
                <div className="mt-1 font-bold">{t.name}</div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-primary">From ${t.priceUsd}</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {t.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
