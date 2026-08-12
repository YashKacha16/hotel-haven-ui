import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/lib/reveal";
import { PageShell, PageHero } from "@/components/PageShell";
import { useBrand } from "@/lib/settings";

interface Chef {
  id: number;
  name: string;
  role?: string;
  description?: string;
  imageUrl?: string;
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About Us` },
      { name: "description", content: "Learn more about our team and history." },
      { property: "og:title", content: `About Us` },
    ],
  }),
  component: About,
});

function About() {
  const BRAND = useBrand();
  const [chefs, setChefs] = useState<Chef[]>([]);

  useEffect(() => {
    fetch("http://localhost:5157/api/Chefs")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setChefs(data);
        }
      })
      .catch(() => {});
  }, []);

  const aboutText = BRAND.aboutText;
  const paragraphs = aboutText ? aboutText.split(/\n+/).filter(Boolean) : [];

  const hasChefData = chefs.length > 0 || (BRAND.chefName && BRAND.chefName.trim() !== "");

  return (
    <PageShell>
      <PageHero 
        eyebrow="Our story" 
        title={BRAND.name ? `About ${BRAND.name}` : "About Us"} 
        image="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1920&q=80" 
      />

      {paragraphs.length > 0 ? (
        <section className="mx-auto max-w-4xl px-4 sm:px-6 py-20">
          <Reveal>
            {paragraphs.map((p, index) => (
              <p
                key={index}
                className={index === 0 ? "font-serif text-2xl leading-relaxed text-foreground/90 mb-6" : "mt-6 text-muted-foreground leading-relaxed"}
              >
                {p}
              </p>
            ))}
          </Reveal>
        </section>
      ) : null}

      {hasChefData ? (
        chefs.length > 1 ? (
          <section className="bg-cream/60 py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <Reveal className="text-center mb-12">
                <div className="text-xs tracking-[0.3em] uppercase text-gold">Culinary Team</div>
                <h2 className="font-serif text-4xl mt-2">Meet the Chefs</h2>
              </Reveal>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {chefs.map((c, index) => (
                  <Reveal key={c.id} delay={index * 80}>
                    <Card className="overflow-hidden border-0 shadow-sm bg-background h-full rounded-2xl flex flex-col">
                      <div className="aspect-[4/5] overflow-hidden relative bg-muted">
                        {c.imageUrl ? (
                          <img
                            src={`http://localhost:5157${c.imageUrl}`}
                            alt={c.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No Photo</div>
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-serif text-2xl">{c.name}</h3>
                        {c.role && <div className="text-xs tracking-wider uppercase text-gold mt-1 font-semibold">{c.role}</div>}
                        {c.description && <p className="text-sm text-muted-foreground mt-3 leading-relaxed flex-1 whitespace-pre-line">{c.description}</p>}
                      </div>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-cream/60 py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
              <Reveal>
                <img
                  src={chefs.length === 1 && chefs[0].imageUrl ? `http://localhost:5157${chefs[0].imageUrl}` : (BRAND.chefImageUrl || "")}
                  className="rounded-2xl aspect-[4/5] object-cover w-full shadow-lg"
                  alt={chefs.length === 1 ? chefs[0].name : (BRAND.chefName || "Chef")}
                />
              </Reveal>
              <Reveal delay={120}>
                <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">
                  {chefs.length === 1 && chefs[0].role ? chefs[0].role : "Meet the Chef"}
                </div>
                <h2 className="font-serif text-4xl">
                  {chefs.length === 1 ? chefs[0].name : BRAND.chefName}
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">
                  {chefs.length === 1 ? chefs[0].description : BRAND.chefDescription}
                </p>
              </Reveal>
            </div>
          </section>
        )
      ) : null}
    </PageShell>
  );
}
