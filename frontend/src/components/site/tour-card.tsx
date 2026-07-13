import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Star, ArrowRight } from "lucide-react";
import type { Tour } from "@/lib/mock-data";

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      to="/tours/$slug"
      params={{ slug: tour.slug }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft
                 transition-all duration-500 hover:-translate-y-2 hover:shadow-elevated hover:border-primary/30"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={tour.image}
          alt={tour.name}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                        opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Price badge */}
        <div className="absolute right-3 top-3 rounded-full bg-card/95 px-3 py-1 text-sm font-bold
                        text-foreground backdrop-blur shadow-soft">
          ${tour.priceUsd}
          <span className="ml-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">/person</span>
        </div>

        {/* Available badge */}
        {tour.available && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-palm/90 px-3 py-1
                          text-[11px] font-semibold uppercase tracking-wider text-secondary-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Available
          </div>
        )}

        {/* Hover CTA overlay */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 pb-4
                        opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-sm font-bold text-accent-foreground shadow-gold">
            View details <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {tour.location}
            <span>•</span>
            <Clock className="h-3 w-3" /> {tour.durationHours}h
          </div>
          <h3 className="mt-2 text-lg font-bold text-balance leading-snug">{tour.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{tour.tagline}</p>
        </div>

        {/* Highlights preview */}
        <div className="flex flex-wrap gap-1.5">
          {tour.highlights.slice(0, 2).map((h) => (
            <span key={h} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              {h}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold">{tour.rating}</span>
            <span className="text-muted-foreground">({tour.reviewCount.toLocaleString()})</span>
          </div>
          <span className="flex items-center gap-1 font-semibold text-primary
                           transition-transform duration-300 group-hover:translate-x-1">
            Explore <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
