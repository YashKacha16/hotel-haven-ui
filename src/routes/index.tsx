import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Star, ArrowRight, Wifi, Waves, Flower2, Car, UtensilsCrossed, Dumbbell, BellRing, Plane, ShieldCheck, BadgeCheck, Clock } from "lucide-react";
import { BRAND, IMG, rooms, reviews, menu, amenities, gallery } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { Reveal } from "@/lib/reveal";
import { BookRoomDialog } from "@/components/BookRoomDialog";
import { toast } from "sonner";

const iconMap: Record<string, any> = { Wifi, Waves, Flower2, Car, UtensilsCrossed, Dumbbell, BellRing, Plane };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BRAND.name} — Boutique Hotel & Coastal Restaurant` },
      { name: "description", content: `${BRAND.tagline} Book rooms, reserve a table and order in-room dining at ${BRAND.name}.` },
      { property: "og:title", content: `${BRAND.name} — A boutique retreat` },
      { property: "og:description", content: BRAND.tagline },
    ],
  }),
  component: Home,
});

function Home() {
  const { requireAuth } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState<typeof rooms[number] | null>(null);
  const featured = rooms.slice(0, 4);

  const bookRoom = () => requireAuth("Book a room", () => navigate({ to: "/rooms" }));
  const reserveTable = () => requireAuth("Reserve a table", () => navigate({ to: "/dining", hash: "reserve" }));
  const orderFood = () => requireAuth("Order to room", () => navigate({ to: "/order" }));

  return (
    <main>
      {/* HERO */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <img src={IMG.hero} alt="" className="absolute inset-0 h-full w-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 text-white pt-24 pb-16">
          <div className="text-xs tracking-[0.4em] uppercase text-gold mb-6 animate-in fade-in duration-700">A boutique retreat</div>
          <h1 className="font-serif text-6xl sm:text-8xl leading-[1.02] max-w-4xl text-balance animate-in fade-in slide-in-from-bottom-4 duration-1000">{BRAND.name}</h1>
          <p className="mt-6 max-w-xl text-white/85 text-lg">{BRAND.tagline}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={bookRoom} size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 gold-glow h-12 px-8">Book a Room</Button>
            <Button onClick={reserveTable} size="lg" variant="outline" className="border-white/70 text-white hover:bg-white hover:text-forest h-12 px-8 bg-transparent">Reserve a Table</Button>
          </div>
          <button onClick={orderFood} className="mt-6 text-sm text-white/80 hover:text-gold underline underline-offset-4">Order food to your room →</button>
        </div>
      </section>

      {/* WELCOME */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <img src={IMG.welcome} alt="Maison Auréa welcome" className="rounded-2xl aspect-[4/5] object-cover w-full shadow-lg" />
        </Reveal>
        <Reveal delay={120}>
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Welcome</div>
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight">A century-old villa, reimagined as a home for slow travellers.</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">Set among frangipani and mango groves a short walk from the sea, {BRAND.name} has just eighteen rooms and a fiercely loved restaurant. Everything here — the linen, the cutlery, the fish on the grill — is chosen by people who care what you'll remember tomorrow.</p>
          <Link to="/about" className="inline-flex items-center gap-2 mt-8 text-gold hover:gap-3 transition-all">Our story <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
      </section>

      {/* FEATURED ROOMS */}
      <section className="bg-cream/60 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Featured Stays</div>
              <h2 className="font-serif text-4xl sm:text-5xl">Rooms & suites</h2>
            </div>
            <Link to="/rooms" className="text-gold flex items-center gap-2 hover:gap-3 transition-all">View all rooms <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((r, i) => (
              <Reveal key={r.id} delay={i * 80}>
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-shadow group py-0 pb-5 gap-0">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={r.images[0]} alt={r.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <div className="text-xs tracking-widest uppercase text-gold">{r.tag}</div>
                    <h3 className="font-serif text-xl mt-1">{r.name}</h3>
                    <div className="flex items-baseline justify-between mt-3">
                      <span className="text-sm text-muted-foreground">from</span>
                      <span><span className="font-serif text-xl">₹{r.price.toLocaleString()}</span><span className="text-xs text-muted-foreground"> /night</span></span>
                    </div>
                    <Button onClick={() => requireAuth("Book this room", () => setBook(r))} className="w-full mt-4 bg-forest text-forest-foreground hover:bg-forest/90">Book</Button>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* KITCHEN */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">A Taste of Our Kitchen</div>
          <h2 className="font-serif text-4xl sm:text-5xl">Chef Aditi's coastal menu</h2>
          <p className="mt-4 text-muted-foreground">Line-caught seafood, heritage rice and the vegetables our neighbours grow.</p>
        </Reveal>
        <Tabs defaultValue="Main Course">
          <TabsList className="mx-auto flex w-fit bg-cream">
            {["Starters","Main Course","Desserts"].map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
          </TabsList>
          {(["Starters","Main Course","Desserts"] as const).map((c) => (
            <TabsContent key={c} value={c} className="mt-10">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu[c].slice(0,3).map((d, i) => (
                  <Reveal key={d.name} delay={i * 80}>
                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-shadow group py-0 pb-4 gap-0">
                      <div className="aspect-[5/4] overflow-hidden"><img src={d.img} alt={d.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-serif text-xl">{d.name}</h3>
                          <span className="font-serif text-lg text-gold">₹{d.price}</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{d.desc}</p>
                      </div>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <div className="text-center mt-10"><Link to="/dining"><Button variant="outline">View full menu</Button></Link></div>
      </section>

      {/* AMENITIES */}
      <section className="bg-forest text-forest-foreground py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-y-8">
            {amenities.map((a) => {
              const I = iconMap[a.icon];
              return (
                <div key={a.name} className="flex flex-col items-center text-center gap-2">
                  <I className="h-6 w-6 text-gold" />
                  <span className="text-xs tracking-wide">{a.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Loved by guests</div>
          <h2 className="font-serif text-4xl sm:text-5xl">Stories from our stay</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 100}>
              <Card className="p-8 h-full border-0 shadow-sm bg-cream/60">
                <div className="flex gap-1 mb-3">{Array.from({length: r.rating}).map((_,i) => <Star key={i} className="h-4 w-4 fill-gold text-gold" />)}</div>
                <p className="font-serif text-lg leading-relaxed">"{r.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <img src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full object-cover" />
                  <div><div className="text-sm font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.city}</div></div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="bg-cream/60 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">In the moment</div>
              <h2 className="font-serif text-4xl sm:text-5xl">A glimpse</h2>
            </div>
            <Link to="/gallery" className="text-gold flex items-center gap-2 hover:gap-3 transition-all">Open gallery <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {gallery.slice(0, 8).map((g, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className={`overflow-hidden rounded-xl ${i % 5 === 0 ? "aspect-[3/4]" : "aspect-square"}`}>
                  <img src={g.src} alt="" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="relative py-24 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest/80" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center text-forest-foreground">
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Stay in touch</div>
          <h2 className="font-serif text-4xl sm:text-5xl">Letters from the coast</h2>
          <p className="mt-4 text-forest-foreground/80">Seasonal menus, quiet weeks and member-only rates — once a month, never more.</p>
          <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => { e.preventDefault(); toast.success("Welcome to the letters."); }}>
            <Input placeholder="you@example.com" className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12" />
            <Button type="submit" className="bg-gold text-gold-foreground hover:bg-gold/90 h-12 px-8">Subscribe</Button>
          </form>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-border bg-cream/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { i: BadgeCheck, t: "Best Price Guarantee", s: "Book direct, save more." },
            { i: ShieldCheck, t: "Free Cancellation", s: "On most rates, up to 48h." },
            { i: Clock, t: "24/7 Concierge", s: "Real people, any hour." },
          ].map((x) => (
            <div key={x.t} className="flex items-center justify-center gap-3">
              <x.i className="h-5 w-5 text-gold" />
              <div className="text-left"><div className="text-sm font-medium">{x.t}</div><div className="text-xs text-muted-foreground">{x.s}</div></div>
            </div>
          ))}
        </div>
      </section>

      <BookRoomDialog room={book} open={!!book} onOpenChange={(v) => !v && setBook(null)} />
    </main>
  );
}
