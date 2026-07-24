import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Check, CalendarPlus, Utensils } from "lucide-react";
import { toast } from "sonner";
import { BRAND, menu } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { Reveal } from "@/lib/reveal";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/dining")({
  head: () => ({
    meta: [
      { title: `Dining — ${BRAND.name}` },
      { name: "description", content: "Chef Aditi Rao's coastal menu. Reserve a table by the sea or in our courtyard." },
      { property: "og:title", content: `Dining at ${BRAND.name}` },
      { property: "og:description", content: "Coastal fine-dining, chef's tasting and open-fire seafood." },
    ],
  }),
  component: DiningPage,
});

const times = ["12:00","12:30","13:00","13:30","19:00","19:30","20:00","20:30","21:00","21:30"];
const availability: Record<string,"green"|"amber"|"red"> = { "12:00":"green","12:30":"green","13:00":"amber","13:30":"green","19:00":"amber","19:30":"red","20:00":"amber","20:30":"green","21:00":"green","21:30":"green" };

function DiningPage() {
  const { requireAuth } = useAuth();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00");
  const [guests, setGuests] = useState(2);
  const [seat, setSeat] = useState("Outdoor");
  const [occ, setOcc] = useState("Casual");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  const [rid] = useState(() => "RSV-" + Math.floor(10000 + Math.random() * 90000));

  const submit = () => requireAuth("Reserve a table", () => setDone(true));

  return (
    <PageShell>
      <PageHero eyebrow="Dining" title="Chef Aditi's coastal menu" subtitle="Line-caught seafood, heritage grain and the vegetables our neighbours grow." image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80" />

      {/* MENU */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <Reveal className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">The menu</div>
          <h2 className="font-serif text-4xl sm:text-5xl">Read the whole thing</h2>
        </Reveal>
        <Tabs defaultValue="Starters">
          <TabsList className="mx-auto flex w-fit flex-wrap h-auto bg-cream">
            {Object.keys(menu).map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
          </TabsList>
          {Object.entries(menu).map(([cat, items]) => (
            <TabsContent key={cat} value={cat} className="mt-10">
              <div className="grid md:grid-cols-2 gap-6">
                {items.map((d, i) => (
                  <Reveal key={d.name} delay={i * 60}>
                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition py-0 gap-0 flex flex-row">
                      <img src={d.img} alt={d.name} className="w-40 h-40 object-cover shrink-0" />
                      <div className="p-5 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`h-3 w-3 border ${d.veg ? "border-green-700" : "border-red-700"} p-[2px]`}><span className={`block h-full w-full rounded-full ${d.veg ? "bg-green-700" : "bg-red-700"}`} /></span>
                              <h3 className="font-serif text-lg">{d.name}</h3>
                            </div>
                            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{d.desc}</p>
                            <div className="mt-2 flex gap-1.5 flex-wrap">{d.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px] tracking-widest uppercase">{t}</Badge>)}</div>
                          </div>
                          <span className="font-serif text-lg text-gold whitespace-nowrap">₹{d.price}</span>
                        </div>
                      </div>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* RESERVE */}
      <section id="reserve" className="bg-forest text-forest-foreground py-24 scroll-mt-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal className="text-center mb-10">
            <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">A seat for you</div>
            <h2 className="font-serif text-4xl sm:text-5xl">Reserve a table</h2>
            <p className="mt-4 text-forest-foreground/70">Our small dining room fills quickly on weekends — a light hand ahead is always kind.</p>
          </Reveal>
          <Card className="p-6 sm:p-8 bg-background text-foreground border-0 shadow-2xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><Label className="text-xs uppercase tracking-widest text-muted-foreground">Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" /></div>
              <div><Label className="text-xs uppercase tracking-widest text-muted-foreground">Guests</Label>
                <div className="mt-1 flex items-center border border-input rounded-md h-10">
                  <button onClick={() => setGuests(Math.max(1, guests-1))} className="px-3 h-full hover:bg-accent"><Minus className="h-3 w-3" /></button>
                  <span className="flex-1 text-center">{guests}</span>
                  <button onClick={() => setGuests(guests+1)} className="px-3 h-full hover:bg-accent"><Plus className="h-3 w-3" /></button>
                </div>
              </div>
              <div><Label className="text-xs uppercase tracking-widest text-muted-foreground">Seating</Label><Select value={seat} onValueChange={setSeat}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{["Indoor","Outdoor","AC","Private","Window"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-xs uppercase tracking-widest text-muted-foreground">Occasion</Label><Select value={occ} onValueChange={setOcc}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{["Casual","Birthday","Anniversary","Business"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="mt-6">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Time</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {times.map((t) => {
                  const a = availability[t];
                  const disabled = a === "red";
                  return (
                    <button key={t} disabled={disabled} onClick={() => setTime(t)} className={`px-4 h-10 rounded-md border text-sm flex items-center gap-2 transition ${time===t ? "border-gold bg-gold text-gold-foreground" : "border-border hover:border-gold"} ${disabled ? "opacity-40 cursor-not-allowed line-through" : ""}`}>
                      <span className={`h-2 w-2 rounded-full ${a==="green"?"bg-green-500":a==="amber"?"bg-amber-500":"bg-red-500"}`} />{t}
                    </button>
                  );
                })}
              </div>
              <div className="text-xs text-muted-foreground mt-2">Green = plenty of space · Amber = limited · Red = full</div>
            </div>
            {occ !== "Casual" && (
              <div className="mt-6"><Label className="text-xs uppercase tracking-widest text-muted-foreground">Décor note</Label><Input placeholder={`Any special touch for the ${occ.toLowerCase()}?`} className="mt-1" /></div>
            )}
            <div className="mt-4"><Label className="text-xs uppercase tracking-widest text-muted-foreground">Special requests</Label><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, seating preferences…" className="mt-1" /></div>
            <Button onClick={submit} className="mt-6 w-full h-12 bg-gold text-gold-foreground hover:bg-gold/90 gold-glow"><Utensils className="h-4 w-4 mr-2" />Reserve Table</Button>
          </Card>
        </div>
      </section>

      {/* Confirmation */}
      <Dialog open={done} onOpenChange={setDone}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader><DialogTitle className="font-serif text-2xl">Table reserved</DialogTitle></DialogHeader>
          <div className="mx-auto h-16 w-16 rounded-full bg-gold/20 grid place-items-center animate-in zoom-in duration-500"><Check className="h-8 w-8 text-gold" /></div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Reservation ID</div>
          <div className="font-serif text-2xl">{rid}</div>
          <div className="bg-cream/60 rounded-xl p-4 text-left text-sm space-y-1.5">
            <Row k="Date" v={date || "Today"} /><Row k="Time" v={time} /><Row k="Party" v={`${guests} guests`} /><Row k="Seating" v={seat} /><Row k="Occasion" v={occ} />
          </div>
          <div className="flex justify-center gap-2">
            <Button variant="outline"><CalendarPlus className="h-4 w-4 mr-2" />Add to calendar</Button>
            <Button className="bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => { setDone(false); toast.success("See you soon!"); }}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
function Row({ k, v }: { k: string; v: string }) { return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span>{v}</span></div>; }
