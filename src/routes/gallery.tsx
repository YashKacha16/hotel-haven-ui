import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/lib/reveal";
import { PageShell, PageHero } from "@/components/PageShell";

interface GalleryItem {
  id: number;
  imageUrl?: string;
  description?: string;
}

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: `Gallery` },
      { name: "description", content: "View our photo gallery." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetch("https://hotel-backend.runasp.net/api/Gallery")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        }
      })
      .catch(() => { });
  }, []);

  return (
    <PageShell>
      <PageHero
        eyebrow="Our Gallery"
        title="Photo Gallery"
        image="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <Reveal className="text-center mb-12">
          <div className="text-xs tracking-[0.3em] uppercase text-gold">Memories</div>
          <h2 className="font-serif text-4xl mt-2">A Glimpse of the Experience</h2>
        </Reveal>
        
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">No photos available yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <Reveal key={item.id} delay={index * 80}>
                <Card className="overflow-hidden border-0 shadow-sm bg-background h-full rounded-2xl flex flex-col group">
                  <div className="aspect-[4/3] overflow-hidden relative bg-muted">
                    {item.imageUrl ? (
                      <img
                        src={`https://hotel-backend.runasp.net/attachments/gallery/${item.imageUrl}`}
                        alt={item.description || "Gallery"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://hotel-backend.runasp.net/${item.imageUrl}`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No Photo</div>
                    )}
                  </div>
                  {item.description && (
                    <div className="p-4 flex-1 flex flex-col bg-cream/30">
                      <p className="text-sm text-foreground/80 leading-relaxed text-center">{item.description}</p>
                    </div>
                  )}
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
