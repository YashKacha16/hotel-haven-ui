import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Award, Leaf, HandHeart, Sparkles } from "lucide-react";
import { BRAND, IMG } from "@/lib/data";
import { Reveal } from "@/lib/reveal";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${BRAND.name}` },
      { name: "description", content: "The story, the people and the values behind Maison Auréa." },
      { property: "og:title", content: `About ${BRAND.name}` },
      { property: "og:description", content: "A century-old villa, reimagined." },
    ],
  }),
  component: About,
});

const values = [
  { i: Leaf, t: "Grown near", d: "Ninety percent of what we cook comes from within 40 km." },
  { i: HandHeart, t: "Hands on", d: "Eighteen rooms and a family-sized team who remember your name." },
  { i: Sparkles, t: "Quiet craft", d: "Every fixture, glaze and print made by artisans we know." },
];
const awards = ["Condé Nast Traveller · 2024","Travel + Leisure · Best New Retreats","EazyDiner Best Coastal Kitchen 2025","World Luxury Hotel Awards"];

function About() {
  return (
    <PageShell>
      <PageHero eyebrow="Our story" title="A house that started with a letter" image="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1920&q=80" />
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-20">
        <Reveal>
          <p className="font-serif text-2xl leading-relaxed text-foreground/90">In 2018 my grandmother left me a house she had loved for forty years and a letter that said: <em>keep it kind.</em> {BRAND.name} is what that letter became — eighteen rooms, a small restaurant, and a promise to move gently through the days.</p>
          <p className="mt-6 text-muted-foreground leading-relaxed">We opened in 2021 with six rooms and a wood-fired grill. Today the villa stretches to a garden pavilion, a wellness room and a bar that closes when the last conversation ends. Nothing here is at scale — it never will be.</p>
        </Reveal>
      </section>

      <section className="bg-cream/60 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
          <Reveal><img src={IMG.chef} className="rounded-2xl aspect-[4/5] object-cover w-full shadow-lg" /></Reveal>
          <Reveal delay={120}>
            <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Meet the Chef</div>
            <h2 className="font-serif text-4xl">Aditi Rao</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">Trained in Copenhagen and Bengaluru, Chef Aditi builds her menus around the sea and the season. Expect line-caught fish, heritage rice, and a fierce loyalty to the growers she has cooked with for a decade.</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <Reveal className="text-center mb-10"><h2 className="font-serif text-4xl">What we care about</h2></Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <Reveal key={v.t} delay={i * 80}>
              <Card className="p-8 border-0 shadow-sm bg-cream/40 h-full">
                <v.i className="h-8 w-8 text-gold" />
                <h3 className="font-serif text-2xl mt-4">{v.t}</h3>
                <p className="text-muted-foreground mt-2">{v.d}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-forest text-forest-foreground py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-6 justify-center"><Award className="h-5 w-5 text-gold" /><span className="text-xs tracking-[0.3em] uppercase text-gold">Recognitions</span></div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-forest-foreground/80">
            {awards.map((a) => <div key={a} className="border border-forest-foreground/15 rounded-lg py-4 px-3">{a}</div>)}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
