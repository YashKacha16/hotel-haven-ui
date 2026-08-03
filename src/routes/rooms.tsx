import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Users, MapPin, Wifi, Wind } from "lucide-react";
import { BRAND, rooms } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { Reveal } from "@/lib/reveal";
import { PageShell, PageHero } from "@/components/PageShell";
import { BookRoomDialog } from "@/components/BookRoomDialog";

function mapBackendRoom(backendRoom: any) {
  const basePrice = backendRoom.basePrice || backendRoom.BasePrice || 0;
  const categoryName = backendRoom.category?.name || backendRoom.Category?.Name || "Standard";
  const num = backendRoom.number || backendRoom.Number || "";
  const desc = backendRoom.description || backendRoom.Description || "";
  const rawImages = backendRoom.images || backendRoom.Images || [];
  const rawAmenities = backendRoom.amenities || backendRoom.Amenities || [];

  const images = rawImages.map((img: string) => {
    if (img.startsWith("/")) {
      return `http://localhost:5157${img}`;
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
    amenities: rawAmenities.length > 0 ? rawAmenities : ["WiFi", "AC", "Rain shower"],
    description: desc || `Experience premium comfort in our carefully designed ${categoryName}.`,
    number: num,
    floor: backendRoom.floor || backendRoom.Floor || "",
  };
}

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: `Rooms & Suites — ${BRAND.name}` },
      { name: "description", content: "Eighteen individually designed rooms, suites and villas overlooking the Konkan coast." },
      { property: "og:title", content: `Rooms & Suites — ${BRAND.name}` },
      { property: "og:description", content: "Boutique rooms, suites and private villas." },
    ],
  }),
  component: RoomsPage,
});

function RoomsPage() {
  const { requireAuth } = useAuth();
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState<[number, number]>([5000, 40000]);
  const [details, setDetails] = useState<any | null>(null);
  const [book, setBook] = useState<any | null>(null);
  const [loadedRooms, setLoadedRooms] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5157/api/Rooms")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLoadedRooms(data.map(mapBackendRoom));
        } else {
          setLoadedRooms(rooms);
        }
      })
      .catch(() => {
        setLoadedRooms(rooms);
      });
  }, []);

  const activeRooms = loadedRooms.length > 0 ? loadedRooms : rooms;

  const filtered = useMemo(() => activeRooms.filter((r) => (category === "all" || r.category === category) && r.price >= price[0] && r.price <= price[1]), [category, price, activeRooms]);

  return (
    <PageShell>
      <PageHero eyebrow="Rooms & Suites" title="Eighteen rooms. One quiet philosophy." image="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80" />

      {/* Filter bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 -mt-12 relative z-20">
        <Card className="p-4 sm:p-5 shadow-xl grid gap-4 md:grid-cols-[1fr_1fr_1fr_1fr_auto] items-end">
          <Field label="Check-in"><Input type="date" /></Field>
          <Field label="Check-out"><Input type="date" /></Field>
          <Field label="Guests"><Select defaultValue="2"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[1,2,3,4,5,6].map((n) => <SelectItem key={n} value={String(n)}>{n} guest{n>1?"s":""}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Category"><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Standard">Standard</SelectItem><SelectItem value="Deluxe">Deluxe</SelectItem><SelectItem value="Suite">Suite</SelectItem><SelectItem value="Villa">Villa</SelectItem><SelectItem value="Cottage">Cottage</SelectItem></SelectContent></Select></Field>
          <Button className="bg-gold text-gold-foreground hover:bg-gold/90 h-10"><Search className="h-4 w-4 mr-2" />Search</Button>
          <div className="md:col-span-5">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground"><span>Price / night</span><span className="text-foreground">₹{price[0].toLocaleString()} – ₹{price[1].toLocaleString()}</span></div>
            <Slider min={3000} max={50000} step={500} value={price} onValueChange={(v) => setPrice(v as [number, number])} className="mt-3" />
          </div>
        </Card>
      </div>

      {/* Room grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, i) => (
            <Reveal key={r.id} delay={i * 60}>
              <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition group py-0 pb-6 gap-0 h-full">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={r.images[0]} alt={r.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <Badge className="absolute top-3 left-3 bg-background/85 text-foreground border-0">{r.category}</Badge>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-2xl">{r.name}</h3>
                    <div className="text-right"><div className="font-serif text-xl text-gold">₹{r.price.toLocaleString()}</div><div className="text-xs text-muted-foreground">per night</div></div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {r.floor ? `Floor ${r.floor}` : r.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground flex-1">{r.description}</p>
                  <div className="mt-4 flex gap-3 text-muted-foreground">
                    <Wifi className="h-4 w-4" /><Wind className="h-4 w-4" />
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setDetails(r)}>View Details</Button>
                    <Button className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => requireAuth("Book this room", () => setBook(r))}>Book Now</Button>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Details dialog */}
      <Dialog open={!!details} onOpenChange={(v) => !v && setDetails(null)}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          {details && (
            <>
              <div className="w-full overflow-hidden">
                {details.images[0] && (
                  <img src={details.images[0]} alt={details.name} className="aspect-[16/9] w-full object-cover" />
                )}
              </div>
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="font-serif text-3xl">{details.name}</DialogTitle>
                </DialogHeader>
                <div className="mt-1 text-xs uppercase tracking-widest text-gold">{details.floor ? `Floor ${details.floor}` : details.tag}</div>
                <p className="mt-4 text-muted-foreground">{details.description}</p>
                <div className="mt-6">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Amenities</div>
                  <div className="flex flex-wrap gap-2">{details.amenities.map((a: string) => <Badge key={a} variant="secondary">{a}</Badge>)}</div>
                </div>
                <div className="mt-6 border-t border-border pt-4 flex items-center justify-between">
                  <div><div className="font-serif text-2xl text-gold">₹{details.price.toLocaleString()}</div><div className="text-xs text-muted-foreground">per night, taxes extra</div></div>
                  <Button className="bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => requireAuth("Book this room", () => { const r = details; setDetails(null); setBook(r); })}>Book this room</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BookRoomDialog room={book} open={!!book} onOpenChange={(v) => !v && setBook(null)} />
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      {children}
    </div>
  );
}
