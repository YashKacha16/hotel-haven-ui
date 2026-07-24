import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { PageShell } from "@/components/PageShell";
import { useState } from "react";

const search = z.object({ tab: z.enum(["bookings","orders","profile"]).optional() });

export const Route = createFileRoute("/account")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "My Account — Maison Auréa" }, { name: "description", content: "Manage your bookings, room-service orders and profile." }] }),
  component: Account,
});

const bookings = {
  Upcoming: [
    { type: "Room", title: "Ocean Deluxe · 3 nights", meta: "12–15 Nov · 2 guests", id: "MA-483920", status: "Confirmed", cancelBy: "10 Nov" },
    { type: "Table", title: "Dinner for 4", meta: "8 Nov · 8:30 PM · Outdoor", id: "RSV-54221", status: "Confirmed", cancelBy: "7 Nov" },
  ],
  Completed: [
    { type: "Room", title: "Garden Suite · 2 nights", meta: "4–6 Aug · 2 guests", id: "MA-291043", status: "Completed", cancelBy: "" },
  ],
  Cancelled: [] as any[],
} as const;
const orders = [
  { id: "ORD-99201", title: "Room 204", items: "Coastal Fish Curry, Kulfi × 2", total: 1740, status: "Delivered" },
  { id: "ORD-99188", title: "Room 204", items: "Curry Leaf Gimlet, Mushroom Risotto", total: 1480, status: "Delivered" },
];

function Account() {
  const { user, requireAuth } = useAuth();
  const { tab = "bookings" } = Route.useSearch();
  const [state, setState] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" });

  if (!user) {
    return (
      <PageShell><div className="mx-auto max-w-lg px-4 py-32 text-center">
        <h1 className="font-serif text-3xl">Sign in to view your account</h1>
        <Button className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => requireAuth("Open account", () => {})}>Sign in</Button>
      </div></PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div>
          <div className="text-xs tracking-[0.3em] uppercase text-gold">My Account</div>
          <h1 className="font-serif text-4xl sm:text-5xl mt-2">Welcome back, {user.name.split(" ")[0]}</h1>
        </div>
        <Tabs defaultValue={tab} className="mt-8">
          <TabsList className="bg-cream w-fit">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6">
            <Tabs defaultValue="Upcoming">
              <TabsList className="w-fit">{Object.keys(bookings).map((s) => <TabsTrigger key={s} value={s}>{s}</TabsTrigger>)}</TabsList>
              {Object.entries(bookings).map(([s, arr]) => (
                <TabsContent key={s} value={s} className="mt-6 space-y-4">
                  {arr.length === 0 && <p className="text-muted-foreground text-sm">Nothing here yet.</p>}
                  {arr.map((b: any) => (
                    <Card key={b.id} className="p-6 flex flex-wrap items-center justify-between gap-4 border-0 shadow-sm bg-cream/40">
                      <div>
                        <div className="flex items-center gap-2 text-xs"><Badge variant="secondary">{b.type}</Badge><Badge className="bg-gold text-gold-foreground border-0">{b.status}</Badge></div>
                        <h3 className="font-serif text-xl mt-2">{b.title}</h3>
                        <p className="text-sm text-muted-foreground">{b.meta} · {b.id}</p>
                        {b.cancelBy && <p className="text-xs text-muted-foreground mt-1">Free cancellation until {b.cancelBy}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">View Details</Button>
                        {b.status === "Confirmed" && <Button variant="ghost" className="text-destructive" onClick={() => toast.success("Booking cancelled")}>Cancel</Button>}
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          <TabsContent value="orders" className="mt-6 space-y-4">
            {orders.map((o) => (
              <Card key={o.id} className="p-6 flex flex-wrap items-center justify-between gap-4 border-0 shadow-sm bg-cream/40">
                <div>
                  <div className="text-xs text-muted-foreground">{o.id} · {o.title}</div>
                  <div className="font-serif text-lg mt-1">{o.items}</div>
                  <div className="text-sm mt-1"><span className="text-gold">₹{o.total}</span> · <Badge variant="secondary">{o.status}</Badge></div>
                </div>
                <Link to="/order"><Button variant="outline">Re-order</Button></Link>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card className="p-8 border-0 shadow-sm bg-cream/40 max-w-2xl">
              <h3 className="font-serif text-2xl">Personal details</h3>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div><Label className="text-xs uppercase tracking-widest text-muted-foreground">Name</Label><Input value={state.name} onChange={(e) => setState({...state, name: e.target.value})} className="mt-1" /></div>
                <div><Label className="text-xs uppercase tracking-widest text-muted-foreground">Email</Label><Input value={state.email} onChange={(e) => setState({...state, email: e.target.value})} className="mt-1" /></div>
                <div className="sm:col-span-2"><Label className="text-xs uppercase tracking-widest text-muted-foreground">Phone</Label><Input value={state.phone} onChange={(e) => setState({...state, phone: e.target.value})} className="mt-1" /></div>
              </div>
              <div className="mt-6"><Button className="bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => toast.success("Profile updated")}>Save changes</Button></div>
              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="font-serif text-xl">Preferences</h4>
                <div className="mt-3 flex flex-wrap gap-2">{["Vegetarian","No nuts","High floor","Quiet room","Extra pillows"].map((p) => <Badge key={p} variant="secondary" className="py-1.5 px-3">{p}</Badge>)}</div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
