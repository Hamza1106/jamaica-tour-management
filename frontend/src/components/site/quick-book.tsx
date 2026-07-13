import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";

export function QuickBook({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tripType, setTripType] = useState("airport");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("2");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const search = { type: tripType, pickup, dropoff, date, passengers } as never;
    if (!user) {
      toast.info("Please sign in to continue your booking.");
      navigate({ to: "/auth", search: { redirect: "/book" } as never });
      return;
    }
    navigate({ to: "/book", search });
  };

  return (
    <form
      onSubmit={submit}
      className={`rounded-3xl border border-border/60 bg-card/95 p-4 shadow-elevated backdrop-blur sm:p-6 ${compact ? "" : ""}`}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { id: "airport", label: "Airport Transfer" },
          { id: "tour", label: "Tour Booking" },
          { id: "custom", label: "Custom Ride" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTripType(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tripType === t.id
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <Field icon={<MapPin className="h-4 w-4 text-primary" />} label="Pickup">
          <Input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="MBJ Airport"
            className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
          />
        </Field>
        <Field icon={<MapPin className="h-4 w-4 text-accent-foreground" />} label="Destination">
          <Input
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            placeholder="Negril Resort"
            className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
          />
        </Field>
        <Field icon={<CalendarDays className="h-4 w-4 text-primary" />} label="Date & Time">
          <Input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
          />
        </Field>
        <Field icon={<Users className="h-4 w-4 text-primary" />} label="Passengers">
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger className="border-0 bg-transparent p-0 shadow-none focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 8, 12].map((n) => (
                <SelectItem key={n} value={String(n)}>{n} guest{n > 1 ? "s" : ""}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Button
          type="submit"
          className="h-full min-h-12 rounded-2xl bg-gradient-sunset text-base font-semibold text-accent-foreground shadow-gold hover:opacity-95"
        >
          Search Rides
        </Button>
      </div>
    </form>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-muted/60 px-4 py-3">
      <Label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </Label>
      <div className="mt-1 text-sm font-medium">{children}</div>
    </div>
  );
}
