import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/lib/reveal";
import { BRAND, gallery } from "@/lib/data";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: `Gallery — ${BRAND.name}` },
      { name: "description", content: "A visual diary of rooms, dining, exteriors and events at Maison Auréa." },
      { property: "og:title", content: `Gallery — ${BRAND.name}` },
      { property: "og:description", content: "Photographs from around the hotel." },
    ],
  }),
  component: GalleryPage,
});

const cats = ["All","Rooms","Dining","Events","Exterior"] as const;
function GalleryPage() {
  const [cat, setCat] = useState<typeof cats[number]>("All");
  const items = cat === "All" ? gallery : gallery.filter((g) => g.cat === cat);
  return (
    <PageShell>
      <PageHero eyebrow="Gallery" title="Moments from the house" image="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <Tabs value={cat} onValueChange={(v) => setCat(v as any)}>
          <TabsList className="mx-auto flex w-fit bg-cream">{cats.map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}</TabsList>
        </Tabs>
        <div className="mt-10 columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {items.map((g, i) => (
            <Reveal key={i} delay={(i%6)*40}>
              <div className="overflow-hidden rounded-xl break-inside-avoid">
                <img src={g.src} alt="" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
