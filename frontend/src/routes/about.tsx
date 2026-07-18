import { createFileRoute } from "@tanstack/react-router";
import { Award, Heart, ShieldCheck, Users } from "lucide-react";
import { useDocumentHead } from "@/hooks/use-document-head";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  useDocumentHead("About Us — Irie Island Tours & Transfers", [
    { name: "description", content: "Born-and-raised Jamaican drivers giving travelers the real island experience since 2015." },
  ]);
  return (
    <div className="page-enter">
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-xs font-bold uppercase tracking-widest text-accent">Our story</div>
          <h1 className="mt-2 max-w-2xl text-4xl font-black sm:text-5xl">Built by Jamaicans, for travelers who love Jamaica.</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/90">
            We started in 2015 with one van and a simple mission: give visitors the same warm, reliable, joyful Jamaica we grew up with. Today we run a fleet of 30+ vehicles and a team of 40+ certified guides — and we still answer every call ourselves.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Heart, title: "Locally owned", text: "100% Jamaican-owned and operated. We hire from the communities we drive through." },
          { icon: ShieldCheck, title: "Fully licensed", text: "JUTA-certified fleet, comprehensive insurance, background-checked drivers." },
          { icon: Users, title: "40+ team members", text: "Drivers, guides, dispatchers, and concierges working 24/7 island-wide." },
          { icon: Award, title: "4.9 avg rating", text: "From over 4,200 verified guest reviews across TripAdvisor and Google." },
        ].map((b) => (
          <div key={b.title} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <b.icon className="h-6 w-6" />
            </div>
            <div className="mt-4 text-lg font-bold">{b.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl bg-gradient-sunset p-8 text-accent-foreground shadow-gold sm:p-12">
          <h2 className="text-2xl font-black sm:text-3xl">"One love, one heart, one Jamaica."</h2>
          <p className="mt-3 max-w-xl">Every guest is a friend — and every friend leaves with stories. That's the Irie way.</p>
        </div>
      </section>
    </div>
  );
}
