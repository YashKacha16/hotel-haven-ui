import { RoomImageSlider } from "@/components/RoomImageSlider";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Star, ArrowRight, Wifi, Waves, Flower2, Car, UtensilsCrossed, Dumbbell, BellRing, Plane, ShieldCheck, BadgeCheck, Clock, Wind, Tv, Compass, GlassWater, Bath, Sparkles } from "lucide-react";
import { IMG, rooms, reviews, menu, amenities, gallery } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { useBrand } from "@/lib/settings";
import { Reveal } from "@/lib/reveal";
import { BookRoomDialog } from "@/components/BookRoomDialog";
import { toast } from "sonner";

const iconMap: Record<string, any> = { Wifi, Waves, Flower2, Car, UtensilsCrossed, Dumbbell, BellRing, Plane };

function mapBackendRoom(backendRoom: any) {
  const basePrice = backendRoom.basePrice || backendRoom.BasePrice || 0;
  const categoryName = backendRoom.category?.name || backendRoom.Category?.Name || "Standard";
  const num = backendRoom.number || backendRoom.Number || "";
  const desc = backendRoom.description || backendRoom.Description || "";
  const rawImages = backendRoom.images || backendRoom.Images || [];
  const rawAmenities = backendRoom.amenities || backendRoom.Amenities || [];

  const images = rawImages.map((img: string) => {
    if (img.startsWith("/")) {
      return `https://hotel-backend.runasp.net${img}`;
    }
    return img;
  });

  if (images.length === 0) {
    if (categoryName.toLowerCase().includes("suite")) {
      images.push("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80");
    } else if (categoryName.toLowerCase().includes("villa")) {
      images.push("https://images.unsplash.com/photo-1587985064135-0366536eab42?auto=format&fit=crop&w=1200&q=80");
    } else if (categoryName.toLowerCase().includes("deluxe")) {
      images.push("https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80");
    } else {
      images.push("https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80");
    }
  }

  if (images.length < 2) {
    images.push("https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80");
  }

  const capacity = backendRoom.capacity || backendRoom.Capacity || 2;
  const beds = capacity > 2 ? "King + Sofa" : "King bed";
  const size = categoryName.toLowerCase().includes("suite") ? "48 m²" : categoryName.toLowerCase().includes("villa") ? "110 m²" : "32 m²";
  const tag = categoryName.toLowerCase().includes("suite") ? "Garden View" : categoryName.toLowerCase().includes("villa") ? "Private Pool" : "Courtyard";

  return {
    id: String(backendRoom.id || backendRoom.Id),
    name: `${categoryName} Room ${num}`.trim(),
    category: categoryName,
    price: basePrice,
    tag: tag,
    size: size,
    beds: beds,
    images: images,
    amenities: rawAmenities,
    description: desc || `Experience premium comfort in our carefully designed ${categoryName}.`,
    number: num,
    floor: backendRoom.floor || backendRoom.Floor || "",
  };
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hotel — Boutique Hotel & Coastal Restaurant" },
      { name: "description", content: "A boutique retreat. Book rooms, reserve a table and order in-room dining." },
      { property: "og:title", content: "Hotel — A boutique retreat" },
      { property: "og:description", content: "A boutique retreat." },
    ],
  }),
  component: Home,
});


const getAmenityIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("wifi") || lower.includes("internet")) return Wifi;
  if (lower.includes("pool") || lower.includes("wave") || lower.includes("swim")) return Waves;
  if (lower.includes("spa") || lower.includes("wellness")) return Flower2;
  if (lower.includes("park") || lower.includes("car")) return Car;
  if (lower.includes("dine") || lower.includes("dining") || lower.includes("food") || lower.includes("restaurant")) return UtensilsCrossed;
  if (lower.includes("gym") || lower.includes("fit") || lower.includes("workout")) return Dumbbell;
  if (lower.includes("service") || lower.includes("bell")) return BellRing;
  if (lower.includes("pick") || lower.includes("plane") || lower.includes("transfer") || lower.includes("airport")) return Plane;
  if (lower.includes("tv")) return Tv;
  if (lower.includes("ac") || lower.includes("air")) return Wind;
  if (lower.includes("balcony") || lower.includes("view")) return Compass;
  if (lower.includes("bar") || lower.includes("drink")) return GlassWater;
  if (lower.includes("bath") || lower.includes("tub")) return Bath;
  return Sparkles;
};

function Home() {
  const { requireAuth } = useAuth();
  const BRAND = useBrand();
  const navigate = useNavigate();
  const [book, setBook] = useState<any | null>(null);
  const [loadedRooms, setLoadedRooms] = useState<any[]>([]);
  const [loadedMenu, setLoadedMenu] = useState<Record<string, any[]>>({});
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://hotel-backend.runasp.net/api/Feedbacks")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFeedbacks(data);
        }
      })
      .catch(() => { });

    fetch("https://hotel-backend.runasp.net/api/Rooms")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLoadedRooms(data.map(mapBackendRoom).map(r => ({
            ...r,
            amenities: (r.amenities || []).filter((a: string) => 
              BRAND.hotelAmenities?.map(x => x.toLowerCase()).includes(a.toLowerCase())
            )
          })));
        } else {
          setLoadedRooms(rooms);
        }
      })
      .catch(() => {
        setLoadedRooms(rooms);
      });

    fetch("https://hotel-backend.runasp.net/api/Menu/grouped")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const grouped: Record<string, any[]> = {};
          data.forEach((group: any) => {
            const catName = group.categoryName || group.CategoryName || "Starters";
            const items = group.items || group.Items || [];
            grouped[catName] = items.map((item: any) => {
              const imgUrl = item.image || item.Image || "";
              const finalImg = imgUrl.startsWith("/") ? `https://hotel-backend.runasp.net${imgUrl}` : imgUrl;
              const isVeg = item.veg !== undefined ? item.veg : (item.Veg !== undefined ? item.Veg : true);
              return {
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
        } else {
          setLoadedMenu(menu);
        }
      })
      .catch(() => {
        setLoadedMenu(menu);
      });
  }, []);

  const featured = loadedRooms.slice(0, 4);
  const activeMenu = loadedMenu;

  const bookRoom = () => requireAuth("Book a room", () => navigate({ to: "/rooms" }));
  const orderFood = () => requireAuth("Order to room", () => navigate({ to: "/order" }));

  return (
    <main>
      {/* HERO */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <img src={BRAND.heroImageUrl || IMG.hero} alt="" className="absolute inset-0 h-full w-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 text-white pt-24 pb-16">
          <div className="text-xs tracking-[0.4em] uppercase text-gold mb-6 animate-in fade-in duration-700">A boutique retreat</div>
          <h1 className="font-serif text-6xl sm:text-8xl leading-[1.02] max-w-4xl text-balance animate-in fade-in slide-in-from-bottom-4 duration-1000">{BRAND.name}</h1>
          <p className="mt-6 max-w-xl text-white/85 text-lg">{BRAND.tagline}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={bookRoom} size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 gold-glow h-12 px-8">Book a Room</Button>
          </div>
          <button onClick={orderFood} className="mt-6 text-sm text-white/80 hover:text-gold underline underline-offset-4">Order food to your room →</button>
        </div>
      </section>

      {/* WELCOME */}
      {BRAND.aboutText ? (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <img src={BRAND.welcomeImageUrl || IMG.welcome} alt={`${BRAND.name} welcome`} className="rounded-2xl aspect-[4/5] object-cover w-full shadow-lg" />
          </Reveal>
          <Reveal delay={120}>
            <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Welcome</div>
            <h2 className="font-serif text-4xl sm:text-5xl leading-tight">{BRAND.name ? `Welcome to ${BRAND.name}` : "Welcome"}</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">{BRAND.aboutText}</p>
            <Link to="/about" className="inline-flex items-center gap-2 mt-8 text-gold hover:gap-3 transition-all">Our story <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
        </section>
      ) : null}

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
                    <RoomImageSlider images={r.images} alt={r.name} />
                  </div>
                  <div className="p-5">
                    <div className="text-xs tracking-widest uppercase text-gold">{r.tag}</div>
                    <h3 className="font-serif text-xl mt-1">{r.name}</h3>
                    <div className="flex items-baseline justify-between mt-3">
                      <span className="text-sm text-muted-foreground">from</span>
                      <span><span className="font-serif text-xl">₹{r.price.toLocaleString()}</span><span className="text-xs text-muted-foreground"> /night</span></span>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                      {(r.amenities || []).slice(0, 4).map((a) => (
                        <span key={a} className="px-2 py-0.5 rounded bg-foreground/5 border border-foreground/10 text-[10px] tracking-wider uppercase font-medium">
                          {a}
                        </span>
                      ))}
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
          <h2 className="font-serif text-4xl sm:text-5xl">Our coastal menu</h2>
          <p className="mt-4 text-muted-foreground">Line-caught seafood, heritage rice and the vegetables our neighbours grow.</p>
        </Reveal>
        <Tabs defaultValue={Object.keys(activeMenu)[0] || "Starters"}>
          <TabsList className="mx-auto flex w-fit bg-cream">
            {Object.keys(activeMenu).map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
          </TabsList>
          {Object.entries(activeMenu).map(([c, items]) => (
            <TabsContent key={c} value={c} className="mt-10">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items?.slice(0, 3).map((d: any, i) => (
                  <Reveal key={d.name} delay={i * 80}>
                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-shadow group py-0 pb-4 gap-0">
                      <div className="aspect-[5/4] overflow-hidden"><MenuImage src={d.img} alt={d.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
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
      {feedbacks.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Loved by guests</div>
            <h2 className="font-serif text-4xl sm:text-5xl">Stories from our stay</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {feedbacks.map((r, i) => (
              <Reveal key={r.id || i} delay={i * 100}>
                <Card className="p-8 h-full border-0 shadow-sm bg-cream/60 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 mb-3">{Array.from({ length: r.rating || 5 }).map((_, idx) => <Star key={idx} className="h-4 w-4 fill-gold text-gold" />)}</div>
                    <p className="font-serif text-lg leading-relaxed">"{r.comment}"</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.city || "Guest"}</div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}




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

function MenuImage({ src, alt, className }: { src?: string | null; alt?: string; className?: string }) {
  const [error, setError] = useState(false);
  
  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 text-muted-foreground/30 ${className}`}>
        <UtensilsCrossed className="w-1/3 h-1/3 min-w-8 min-h-8" />
      </div>
    );
  }
  
  return (
    <img src={src} alt={alt} className={className} onError={() => setError(true)} />
  );
}
