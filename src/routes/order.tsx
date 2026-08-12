import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Plus, Minus, ShoppingBag, Clock, Check, BedDouble } from "lucide-react";
import { toast } from "sonner";
import { menu, type MenuItem } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { Reveal } from "@/lib/reveal";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order to your room" },
      { name: "description", content: "In-room dining for our house guests. Order from the full kitchen." },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { requireAuth, user } = useAuth();
  const [activeBooking, setActiveBooking] = useState<any | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);

  useEffect(() => {
    if (!user) {
      setActiveBooking(null);
      setLoadingBooking(false);
      return;
    }
    setLoadingBooking(true);
    fetch(`http://localhost:5157/api/Bookings/active-checkin?email=${encodeURIComponent(user.email)}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setActiveBooking(data);
        setLoadingBooking(false);
      })
      .catch(() => {
        setActiveBooking(null);
        setLoadingBooking(false);
      });
  }, [user]);

  const HAS_ACTIVE_BOOKING = !!activeBooking;
  const ROOM_NUM = activeBooking?.room?.number || "";

  const [cart, setCart] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<null | number>(null);
  const [oid, setOid] = useState(() => "ORD-" + Math.floor(10000 + Math.random() * 90000));
  const [loadedMenu, setLoadedMenu] = useState<Record<string, any[]>>({});
  const [settings, setSettings] = useState<any>(null);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5157/api/Settings/general")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => {});

    const saved = localStorage.getItem("reorder_cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
          setCart(parsed);
          toast.success("Re-order items loaded into your cart!");
        }
      } catch {}
      localStorage.removeItem("reorder_cart");
    }
  }, []);

  const currencySymbol = settings?.currency?.match(/\((.*?)\)/)?.[1] || settings?.currency || "₹";
  const cgstPercent = settings?.cgstPercent ?? 9;
  const sgstPercent = settings?.sgstPercent ?? 9;
  const taxPercent = cgstPercent + sgstPercent;
  const serviceChargePercent = settings?.serviceChargePercent ?? 10;

  useEffect(() => {
    fetch("http://localhost:5157/api/Menu/grouped")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const grouped: Record<string, any[]> = {};
          data.forEach((group: any) => {
            const catName = group.categoryName || group.CategoryName || "Starters";
            const items = group.items || group.Items || [];
            grouped[catName] = items.map((item: any) => {
              const imgUrl = item.image || item.Image || "";
              const finalImg = imgUrl.startsWith("/") ? `http://localhost:5157${imgUrl}` : imgUrl;
              const isVeg = item.veg !== undefined ? item.veg : (item.Veg !== undefined ? item.Veg : true);
              return {
                id: item.id || item.Id,
                name: item.name || item.Name,
                price: item.price || item.Price,
                veg: isVeg,
                tags: isVeg ? ["Vegetarian"] : ["Non-Vegetarian"],
                desc: item.description || item.Description || "",
                img: finalImg || null,
              };
            });
          });
          setLoadedMenu(grouped);
        }
      })
      .catch(() => {});
  }, []);

  const activeMenu = loadedMenu;
  const items = useMemo(() => Object.entries(activeMenu).flatMap(([cat, arr]) => arr.map((i) => ({ ...i, cat }))), [activeMenu]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + (cart[i.name] ?? 0) * i.price, 0), [cart, items]);
  const taxes = Math.round(subtotal * (taxPercent / 100));
  const serviceFee = Math.round(subtotal * (serviceChargePercent / 100));
  const grandTotal = subtotal + taxes + serviceFee;
  const count = Object.values(cart).reduce((s, v) => s + v, 0);

  const add = (n: string) => setCart((c) => ({ ...c, [n]: (c[n] ?? 0) + 1 }));
  const sub = (n: string) => setCart((c) => { const v = (c[n] ?? 0) - 1; const cp = { ...c }; if (v <= 0) delete cp[n]; else cp[n] = v; return cp; });

  const place = () => requireAuth("Place your order", async () => {
    if (count === 0) return;
    setPlacing(true);
    try {
      const selectedItems = items.filter((i) => cart[i.name]).map((i) => ({
        menuItemId: i.id || 1,
        name: i.name,
        quantity: cart[i.name],
        priceAtOrder: i.price
      }));

      const payload = {
        type: "RoomService",
        roomNumber: ROOM_NUM,
        customerName: user?.name || "Guest",
        specialInstructions: notes,
        items: selectedItems
      };

      const res = await fetch("http://localhost:5157/api/Orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to place order.");
      }

      const createdOrder = await res.json();
      const newOid = createdOrder.orderNumber || oid;
      setOid(newOid);

      setStatus(0);
      setCart({});
      setNotes("");
      toast.success("Order placed successfully!", { description: `${newOid} · ETA 25–35 min` });
      [1, 2, 3].forEach((s, i) => setTimeout(() => setStatus(s), (i + 1) * 4000));
    } catch (e: any) {
      toast.error(e.message || "Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  });

  if (!user) {
    return (
      <PageShell className="min-h-screen">
        <div className="mx-auto max-w-lg px-4 py-32 text-center">
          <BedDouble className="h-10 w-10 mx-auto text-gold" />
          <h1 className="font-serif text-3xl mt-4">Sign in to order</h1>
          <p className="text-muted-foreground mt-2">In-room dining is available for our house guests.</p>
          <Button className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => requireAuth("Order food", () => {})}>Sign in</Button>
        </div>
      </PageShell>
    );
  }

  if (loadingBooking) {
    return (
      <PageShell className="min-h-screen">
        <div className="mx-auto max-w-lg px-4 py-32 text-center">
          <p className="text-muted-foreground animate-pulse">Checking in-house stay details...</p>
        </div>
      </PageShell>
    );
  }

  if (!HAS_ACTIVE_BOOKING) {
    return (
      <PageShell className="min-h-screen">
        <div className="mx-auto max-w-lg px-4 py-32 text-center">
          <BedDouble className="h-10 w-10 mx-auto text-gold" />
          <h1 className="font-serif text-3xl mt-4">For our house guests</h1>
          <p className="text-muted-foreground mt-2">Order food is available for in-house guests. Book a room to unlock in-room dining.</p>
          <Link to="/rooms"><Button className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90">Book a Room</Button></Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-gold">In-room dining</div>
            <h1 className="font-serif text-4xl sm:text-5xl mt-2">Order to Room {ROOM_NUM}</h1>
            <p className="text-muted-foreground mt-2">Available now · Average delivery 25–35 min</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-forest text-forest-foreground hover:bg-forest/90 relative"><ShoppingBag className="h-4 w-4 mr-2" />Cart {count > 0 && <span className="ml-2 rounded-full bg-gold text-gold-foreground text-xs px-2 py-0.5">{count}</span>}</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetTitle className="font-serif text-2xl">Your order</SheetTitle>
              <div className="flex-1 overflow-y-auto space-y-3 py-4">
                {count === 0 && <p className="text-sm text-muted-foreground">Your cart is empty. Browse the menu to add dishes.</p>}
                {items.filter((i) => cart[i.name]).map((i) => (
                  <div key={i.name} className="flex gap-3">
                    {i.img && <img src={i.img} className="h-16 w-16 rounded-md object-cover" />}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{i.name}</div>
                      <div className="text-xs text-muted-foreground">{currencySymbol}{i.price}</div>
                      <div className="mt-1 inline-flex items-center border border-border rounded-md">
                        <button onClick={() => sub(i.name)} className="px-2 h-7 hover:bg-accent"><Minus className="h-3 w-3" /></button>
                        <span className="w-6 text-center text-sm">{cart[i.name]}</span>
                        <button onClick={() => add(i.name)} className="px-2 h-7 hover:bg-accent"><Plus className="h-3 w-3" /></button>
                      </div>
                    </div>
                    <div className="text-sm">{currencySymbol}{(cart[i.name] * i.price).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <Textarea placeholder="Special instructions…" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
                
                <div className="space-y-1.5 text-xs bg-cream/50 p-3 rounded-xl border border-border/60">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{currencySymbol}{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Taxes ({taxPercent}%)</span><span>{currencySymbol}{taxes.toLocaleString()}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Service charge ({serviceChargePercent}%)</span><span>{currencySymbol}{serviceFee.toLocaleString()}</span></div>
                  <div className="flex justify-between font-serif text-base pt-2 border-t border-border/80 text-foreground font-semibold">
                    <span>Total Payable</span>
                    <span className="text-gold">{currencySymbol}{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3 w-3" />ETA to Room {ROOM_NUM}: 25–35 min</div>
                <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90 gold-glow" disabled={count === 0 || placing} onClick={place}>
                  {placing ? "Placing order..." : "Place Order"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Tabs defaultValue={Object.keys(activeMenu)[0]}>
          <TabsList className="flex flex-wrap h-auto bg-cream w-fit">{Object.keys(activeMenu).map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}</TabsList>
          {Object.entries(activeMenu).map(([cat, arr]) => (
            <TabsContent key={cat} value={cat} className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {arr.map((d: any, i) => (
                  <Reveal key={d.name} delay={i * 50}>
                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition py-0 gap-0">
                      <div className="aspect-[5/3] overflow-hidden"><img src={d.img} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" /></div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3"><h3 className="font-serif text-lg">{d.name}</h3><span className="font-serif text-lg text-gold">{currencySymbol}{d.price}</span></div>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{d.desc}</p>
                        <div className="mt-3 flex gap-1.5 flex-wrap">{d.tags.map((t: string) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div>
                        <div className="mt-4 flex justify-end">
                          {cart[d.name] ? (
                            <div className="inline-flex items-center border border-gold rounded-md">
                              <button onClick={() => sub(d.name)} className="px-3 h-9 hover:bg-accent"><Minus className="h-3 w-3" /></button>
                              <span className="w-8 text-center">{cart[d.name]}</span>
                              <button onClick={() => add(d.name)} className="px-3 h-9 hover:bg-accent"><Plus className="h-3 w-3" /></button>
                            </div>
                          ) : (
                            <Button variant="outline" onClick={() => { add(d.name); toast.success(`${d.name} added to your order`); }}><Plus className="h-3 w-3 mr-1" />Add to order</Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Tracker */}
      {status !== null && (
        <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:w-96 z-30">
          <Card className="p-4 shadow-2xl border-gold/40">
            <div className="flex justify-between items-center">
              <div><div className="text-xs text-muted-foreground">Order</div><div className="font-serif text-lg">{oid}</div></div>
              {status === 3 ? <Check className="h-6 w-6 text-gold" /> : <Clock className="h-5 w-5 text-gold" />}
            </div>
            <Progress value={(status + 1) * 25} className="mt-3" />
            <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
              {["Placed","Preparing","On the way","Delivered"].map((s, i) => (
                <span key={s} className={i <= status ? "text-gold font-medium" : ""}>{s}</span>
              ))}
            </div>
          </Card>
        </div>
      )}
    </PageShell>
  );
}
