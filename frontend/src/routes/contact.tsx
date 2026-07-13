import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Irie Island Tours & Transfers" },
      { name: "description", content: "Get in touch with our Jamaica booking team. Available 24/7 by phone, WhatsApp, and email." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(1000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) { toast.error(r.error.issues[0]?.message ?? "Please check the form"); return; }
    toast.success("Thanks — we'll reply within 1 hour.");
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <div className="page-enter" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="text-xs font-bold uppercase tracking-widest text-primary">Talk to us</div>
      <h1 className="mt-2 text-4xl font-black sm:text-5xl">We're here 24/7</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">Booking questions, last-minute changes, or just need a recommendation? Reach us any way that's easiest.</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {[
            { icon: Phone, title: "Call us", value: "+1 876 555 0100", sub: "24 hours · 7 days" },
            { icon: MessageCircle, title: "WhatsApp", value: "+1 876 555 0100", sub: "Fastest replies" },
            { icon: Mail, title: "Email", value: "bookings@irieisland.com", sub: "Replies in <1 hour" },
            { icon: MapPin, title: "Office", value: "12 Gloucester Ave, Montego Bay, Jamaica", sub: "Visit by appointment" },
          ].map((c) => (
            <div key={c.title} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><c.icon className="h-5 w-5" /></div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{c.title}</div>
                <div className="font-bold">{c.value}</div>
                <div className="text-sm text-muted-foreground">{c.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <h2 className="text-lg font-bold">Send a message</h2>
          <div className="mt-5 space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</Label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button type="submit" className="w-full rounded-full bg-gradient-sunset font-semibold text-accent-foreground shadow-gold">Send message</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
