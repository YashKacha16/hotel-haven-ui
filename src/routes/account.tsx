import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";

const search = z.object({ tab: z.enum(["bookings", "orders", "profile"]).optional() });

export const Route = createFileRoute("/account")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "My Account — Hotel" }, { name: "description", content: "Manage your bookings, room-service orders and profile." }] }),
  component: Account,
});

function Account() {
  const { user, requireAuth } = useAuth();
  const navigate = useNavigate();
  const { tab = "bookings" } = Route.useSearch();
  const [state, setState] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" });

  const [loadedBookings, setLoadedBookings] = useState<{ Upcoming: any[]; Completed: any[]; Cancelled: any[] }>({ Upcoming: [], Completed: [], Cancelled: [] });
  const [loadedOrders, setLoadedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const fetchUserData = () => {
    if (!user) return;
    setLoading(true);

    const fetchBookings = fetch(`https://hotel-backend.runasp.net/api/Bookings?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const upcoming: any[] = [];
          const completed: any[] = [];
          const cancelled: any[] = [];
          data.forEach((b: any) => {
            const mapped = {
              dbId: b.id,
              type: "Room",
              title: b.room ? `${b.room.category?.name || "Room"} · Room ${b.room.number}` : "Room",
              meta: `${new Date(b.checkInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${new Date(b.checkOutDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${b.guests} guest${b.guests > 1 ? "s" : ""}`,
              id: b.bookingCode || `MA-${b.id}`,
              status: b.status,
              cancelBy: b.status === "Confirmed" ? new Date(new Date(b.checkInDate).getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "",
              checkIn: new Date(b.checkInDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
              checkOut: new Date(b.checkOutDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
              guests: b.guests,
              advance: b.advanceAmount || 0,
              roomNumber: b.room?.number || "",
              category: b.room?.category?.name || "Room",
              guestName: b.guestName || "",
              email: b.email || "",
              phone: b.phone || "",
              paymentMethod: b.paymentMethod || "Card",
              refundAmount: b.refundAmount ?? 0,
              refundStatus: b.refundStatus || ((b.refundAmount ?? 0) > 0 ? "Refunded" : "No Refund")
            };
            if (b.status === "Checked-in" || b.status === "Confirmed") {
              upcoming.push(mapped);
            } else if (b.status === "Completed") {
              completed.push(mapped);
            } else {
              cancelled.push(mapped);
            }
          });
          setLoadedBookings({ Upcoming: upcoming, Completed: completed, Cancelled: cancelled });
        }
      });

    const fetchOrders = fetch(`https://hotel-backend.runasp.net/api/Orders/client-orders?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLoadedOrders(data.map((o: any) => ({
            id: o.orderNumber || `ORD-${o.id}`,
            title: o.roomNumber ? `Room ${o.roomNumber}` : "Dine In",
            items: o.items.map((i: any) => `${i.name} × ${i.quantity}`).join(", "),
            total: o.subtotal,
            status: o.status,
            rawItems: o.items || []
          })));
        }
      });

    Promise.all([fetchBookings, fetchOrders])
      .finally(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const cancelBooking = async (dbId: number) => {
    try {
      const res = await fetch(`https://hotel-backend.runasp.net/api/Bookings/${dbId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" })
      });
      if (res.ok) {
        toast.success("Booking cancelled successfully.");
        fetchUserData();
      } else {
        toast.error("Failed to cancel booking.");
      }
    } catch {
      toast.error("Failed to cancel booking.");
    }
  };

  if (!user) {
    return (
      <PageShell><div className="mx-auto max-w-lg px-4 py-32 text-center">
        <h1 className="font-serif text-3xl">Sign in to view your account</h1>
        <Button className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => requireAuth("Open account", () => { })}>Sign in</Button>
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
            {loading ? (
              <p className="text-muted-foreground text-sm animate-pulse">Loading bookings...</p>
            ) : (
              <Tabs defaultValue="Upcoming">
                <TabsList className="w-fit">{Object.keys(loadedBookings).map((s) => <TabsTrigger key={s} value={s}>{s}</TabsTrigger>)}</TabsList>
                {Object.entries(loadedBookings).map(([s, arr]) => (
                  <TabsContent key={s} value={s} className="mt-6 space-y-4">
                    {arr.length === 0 && <p className="text-muted-foreground text-sm">Nothing here yet.</p>}
                    {arr.map((b: any) => (
                      <Card key={b.id} className="p-6 flex flex-wrap items-center justify-between gap-4 border-0 shadow-sm bg-cream/40">
                        <div>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="secondary">{b.type}</Badge>
                            <Badge className="bg-gold text-gold-foreground border-0">{b.status}</Badge>
                            {b.status === "Cancelled" && (
                              <Badge variant="outline" className={b.refundAmount > 0 ? "border-emerald-500 text-emerald-500" : "border-muted text-muted-foreground"}>
                                {b.refundAmount > 0 ? `Refunded: ₹${b.refundAmount.toLocaleString()}` : "No Refund"}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-serif text-xl mt-2">{b.title}</h3>
                          <p className="text-sm text-muted-foreground">{b.meta} · {b.id}</p>
                          {b.status === "Cancelled" && b.refundAmount > 0 && (
                            <p className="text-xs text-emerald-500 font-medium mt-1">Refund Amount: ₹{b.refundAmount.toLocaleString()}</p>
                          )}
                          {b.cancelBy && b.status === "Confirmed" && <p className="text-xs text-muted-foreground mt-1">Free cancellation until {b.cancelBy}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setSelectedBooking(b)}>View Details</Button>
                          {b.status === "Confirmed" && <Button variant="ghost" className="text-destructive" onClick={() => cancelBooking(b.dbId)}>Cancel</Button>}
                        </div>
                      </Card>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </TabsContent>

          <TabsContent value="orders" className="mt-6 space-y-4">
            {loading ? (
              <p className="text-muted-foreground text-sm animate-pulse">Loading orders...</p>
            ) : loadedOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nothing here yet.</p>
            ) : (
              loadedOrders.map((o) => (
                <Card key={o.id} className="p-6 flex flex-wrap items-center justify-between gap-4 border-0 shadow-sm bg-cream/40">
                  <div>
                    <div className="text-xs text-muted-foreground">{o.id} · {o.title}</div>
                    <div className="font-serif text-lg mt-1">{o.items}</div>
                    <div className="text-sm mt-1"><span className="text-gold">₹{o.total}</span> · <Badge variant="secondary">{o.status}</Badge></div>
                  </div>
                  <Button variant="outline" onClick={() => {
                    if (o.rawItems && o.rawItems.length > 0) {
                      const cartMap: Record<string, number> = {};
                      o.rawItems.forEach((i: any) => {
                        if (i.name && i.quantity) {
                          cartMap[i.name] = i.quantity;
                        }
                      });
                      localStorage.setItem("reorder_cart", JSON.stringify(cartMap));
                    }
                    navigate({ to: "/order" });
                  }}>
                    Re-order
                  </Button>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card className="p-8 border-0 shadow-sm bg-cream/40 max-w-2xl">
              <h3 className="font-serif text-2xl">Personal details</h3>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div><Label className="text-xs uppercase tracking-widest text-muted-foreground">Name</Label><Input value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} className="mt-1" /></div>
                <div><Label className="text-xs uppercase tracking-widest text-muted-foreground">Email</Label><Input value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} className="mt-1" /></div>
                <div className="sm:col-span-2"><Label className="text-xs uppercase tracking-widest text-muted-foreground">Phone</Label><Input value={state.phone} onChange={(e) => setState({ ...state, phone: e.target.value })} className="mt-1" /></div>
              </div>
              <div className="mt-6"><Button className="bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => toast.success("Profile updated")}>Save changes</Button></div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={!!selectedBooking} onOpenChange={(v) => !v && setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Booking details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 text-sm mt-2">
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Booking Code</span><span className="font-medium font-serif">{selectedBooking.id}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Room</span><span>{selectedBooking.title}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Status</span><span><Badge className="bg-gold text-gold-foreground border-0">{selectedBooking.status}</Badge></span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Check-in</span><span>{selectedBooking.checkIn}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Check-out</span><span>{selectedBooking.checkOut}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Guests</span><span>{selectedBooking.guests}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Advance paid</span><span>₹{selectedBooking.advance.toLocaleString()}</span></div>
              {selectedBooking.status === "Cancelled" && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Refund Status</span>
                  <span className={selectedBooking.refundAmount > 0 ? "text-emerald-500 font-medium" : "text-muted-foreground"}>
                    {selectedBooking.refundAmount > 0 ? `Refunded (₹${selectedBooking.refundAmount.toLocaleString()})` : "No Refund"}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Payment method</span><span className="uppercase">{selectedBooking.paymentMethod}</span></div>
              <div className="flex justify-between pb-2"><span className="text-muted-foreground">Guest details</span><span>{user?.name} ({user?.phone})</span></div>
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button className="bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => setSelectedBooking(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
