import { createFileRoute } from "@tanstack/react-router";
import { Phone, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DRIVERS, type Driver } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/drivers")({
  component: DriversPage,
});

function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(DRIVERS);
  // Track pending (unsaved) status per driver
  const [pending, setPending] = useState<Record<string, Driver["status"]>>({});

  const handleSelectChange = (id: string, s: Driver["status"]) => {
    setPending((prev) => ({ ...prev, [id]: s }));
  };

  const handleAssign = (id: string) => {
    const newStatus = pending[id];
    if (!newStatus) {
      toast.info("No change selected");
      return;
    }
    setDrivers((ds) => ds.map((d) => (d.id === id ? { ...d, status: newStatus } : d)));
    setPending((prev) => { const next = { ...prev }; delete next[id]; return next; });
    toast.success(`Driver status updated → ${newStatus}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {drivers.filter((d) => d.status === "Available").length} available ·{" "}
          {drivers.filter((d) => d.status === "On Trip").length} on trip ·{" "}
          {drivers.filter((d) => d.status === "Off Duty").length} off duty
        </p>
        <Button className="rounded-full bg-gradient-sunset text-accent-foreground shadow-gold">+ Add driver</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {drivers.map((d) => {
          const displayStatus = pending[d.id] ?? d.status;
          const hasChange = pending[d.id] !== undefined && pending[d.id] !== d.status;
          return (
            <div key={d.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-hero text-base font-bold text-primary-foreground">
                  {d.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.id} · {d.vehicle}</div>
                </div>
                <StatusDot status={d.status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-muted/60 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Rating</div>
                  <div className="mt-1 flex items-center gap-1 font-bold"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{d.rating}</div>
                </div>
                <div className="rounded-xl bg-muted/60 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Trips</div>
                  <div className="mt-1 font-bold">{d.trips.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />{d.phone}
              </div>
              <div className="mt-4 flex gap-2">
                <Select value={displayStatus} onValueChange={(v) => handleSelectChange(d.id, v as Driver["status"])}>
                  <SelectTrigger className="h-8 flex-1 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="On Trip">On Trip</SelectItem>
                    <SelectItem value="Off Duty">Off Duty</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant={hasChange ? "default" : "outline"}
                  className="rounded-full text-xs"
                  onClick={() => handleAssign(d.id)}
                >
                  Assign
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: Driver["status"] }) {
  const map = {
    "Available": "bg-primary text-primary-foreground",
    "On Trip":   "bg-accent text-accent-foreground",
    "Off Duty":  "bg-muted text-muted-foreground",
  } as const;
  return (
    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${map[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {status}
    </span>
  );
}