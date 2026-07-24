import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, MessageCircle, MapPin, Mail } from "lucide-react";
import { toast } from "sonner";
import { BRAND } from "@/lib/data";
import { PageShell, PageHero } from "@/components/PageShell";
import { Reveal } from "@/lib/reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${BRAND.name}` },
      { name: "description", content: `Reach ${BRAND.name} by phone, WhatsApp or email. We reply within a few hours.` },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <PageShell>
      <PageHero eyebrow="Contact" title="Say hello" subtitle="We answer every message ourselves — usually within a few hours." image="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1920&q=80" />
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-8">
        <Reveal>
          <Card className="p-8 border-0 shadow-sm bg-cream/40">
            <h2 className="font-serif text-3xl">Send us a note</h2>
            <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Thanks — we'll be in touch shortly."); (e.target as HTMLFormElement).reset(); }}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label className="text-xs uppercase tracking-widest text-muted-foreground">Name</Label><Input required className="mt-1" /></div>
                <div><Label className="text-xs uppercase tracking-widest text-muted-foreground">Email</Label><Input type="email" required className="mt-1" /></div>
              </div>
              <div><Label className="text-xs uppercase tracking-widest text-muted-foreground">Subject</Label><Input className="mt-1" /></div>
              <div><Label className="text-xs uppercase tracking-widest text-muted-foreground">Message</Label><Textarea rows={5} className="mt-1" /></div>
              <Button type="submit" className="bg-gold text-gold-foreground hover:bg-gold/90 w-full h-11">Send message</Button>
            </form>
          </Card>
        </Reveal>
        <Reveal delay={120}>
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-muted grid place-items-center">
              <iframe title="map" src="https://maps.google.com/maps?q=Alibaug&z=13&output=embed" className="w-full h-full border-0" />
            </div>
            <Card className="p-6 border-0 shadow-sm bg-cream/40 space-y-3 text-sm">
              <div className="flex gap-3"><MapPin className="h-4 w-4 mt-0.5 text-gold" />{BRAND.address}</div>
              <div className="flex gap-3"><Phone className="h-4 w-4 mt-0.5 text-gold" />{BRAND.phone}</div>
              <div className="flex gap-3"><Mail className="h-4 w-4 mt-0.5 text-gold" />{BRAND.email}</div>
            </Card>
            <Card className="p-6 border-0 shadow-sm bg-cream/40">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Opening Hours</div>
              <table className="w-full text-sm">
                <tbody>{BRAND.hours.map((h) => (<tr key={h.day} className="border-b border-border/50 last:border-0"><td className="py-2">{h.day}</td><td className="py-2 text-right text-muted-foreground">{h.time}</td></tr>))}</tbody>
              </table>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <a href={`tel:${BRAND.phone.replace(/\s/g,"")}`}><Button variant="outline" className="w-full"><Phone className="h-4 w-4 mr-2" />Call</Button></a>
              <a href="https://wa.me/919820012345"><Button variant="outline" className="w-full"><MessageCircle className="h-4 w-4 mr-2" />WhatsApp</Button></a>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
