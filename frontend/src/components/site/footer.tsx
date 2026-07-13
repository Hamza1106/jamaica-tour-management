import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground">
              <span className="text-base font-black">I</span>
            </div>
            <div>
              <div className="font-bold">Irie Island</div>
              <div className="text-[10px] uppercase tracking-[0.18em] opacity-80">Tours & Transfers</div>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm opacity-80">
            Trusted Jamaica-based taxi and touring company. Safe drivers, premium vehicles, unforgettable experiences.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-70">Explore</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/tours" className="hover:underline">Tours</Link></li>
            <li><Link to="/fleet" className="hover:underline">Our Fleet</Link></li>
            <li><Link to="/book" className="hover:underline">Book a Ride</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-70">Contact</div>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 876 555 0100</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> bookings@irieisland.com</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Montego Bay, Jamaica</li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-70">Follow</div>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"><Facebook className="h-4 w-4" /></a>
          </div>
          <Link to="/admin" className="mt-6 inline-block text-xs opacity-60 hover:opacity-100">Admin login →</Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs opacity-70 sm:flex-row sm:px-6">
          <div>© {new Date().getFullYear()} Irie Island Tours & Transfers. All rights reserved.</div>
          <div>Licensed & insured · JUTA member</div>
        </div>
      </div>
    </footer>
  );
}
