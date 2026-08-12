import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/lib/reveal";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/dining")({
  head: () => ({
    meta: [
      { title: "Dining" },
      { name: "description", content: "Enjoy coastal fine-dining, chef's tasting and open-fire seafood." },
      { property: "og:title", content: "Dining" },
      { property: "og:description", content: "Coastal fine-dining, chef's tasting and open-fire seafood." },
    ],
  }),
  component: DiningPage,
});

function DiningPage() {
  const [loadedMenu, setLoadedMenu] = useState<Record<string, any[]>>({});

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

  return (
    <PageShell>
      <PageHero eyebrow="Dining" title="Chef Aditi's coastal menu" subtitle="Line-caught seafood, heritage grain and the vegetables our neighbours grow." image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80" />

      {/* MENU */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <Reveal className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">The menu</div>
          <h2 className="font-serif text-4xl sm:text-5xl">Read the whole thing</h2>
        </Reveal>
        <Tabs key={Object.keys(activeMenu).join("-")} defaultValue={Object.keys(activeMenu)[0] || "Starters"}>
          <TabsList className="mx-auto flex w-fit flex-wrap h-auto bg-cream">
            {Object.keys(activeMenu).map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
          </TabsList>
          {Object.entries(activeMenu).map(([cat, items]) => (
            <TabsContent key={cat} value={cat} className="mt-10">
              <div className="grid md:grid-cols-2 gap-6">
                {items.map((d, i) => (
                  <Reveal key={d.name} delay={i * 60}>
                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition py-0 gap-0 flex flex-row">
                      {d.img && <img src={d.img} alt={d.name} className="w-40 h-40 object-cover shrink-0" />}
                      <div className="p-5 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`h-3 w-3 border ${d.veg ? "border-green-700" : "border-red-700"} p-[2px]`}><span className={`block h-full w-full rounded-full ${d.veg ? "bg-green-700" : "bg-red-700"}`} /></span>
                              <h3 className="font-serif text-lg">{d.name}</h3>
                            </div>
                            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{d.desc}</p>
                            <div className="mt-2 flex gap-1.5 flex-wrap">{d.tags.map((t: string) => <Badge key={t} variant="secondary" className="text-[10px] tracking-widest uppercase">{t}</Badge>)}</div>
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
    </PageShell>
  );
}
