import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useBrand } from "@/lib/settings";
import { Reveal } from "@/lib/reveal";
import { gallery as mockGallery } from "@/lib/data";

interface GalleryItem {
  id: number;
  imageUrl?: string;
  description?: string;
  createdAt: string;
}

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery" },
      { name: "description", content: "Explore the visual story and memories of our boutique hotel." },
      { property: "og:title", content: "Gallery" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const BRAND = useBrand();
  const [backendItems, setBackendItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const getPhotoUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `https://hotel-backend.runasp.net${cleanUrl}`;
  };

  useEffect(() => {
    fetch("https://hotel-backend.runasp.net/api/Gallery")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: GalleryItem[]) => {
        if (Array.isArray(data)) {
          const mapped = data.map((item, index) => ({
            cat: "Hotel",
            src: getPhotoUrl(item.imageUrl),
            desc: item.description || "",
            h: index % 2 === 0 ? "tall" : "short"
          }));
          setBackendItems(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Combine backend items with default mock gallery items
  // We place custom backend uploads first
  const allItems = [...backendItems, ...mockGallery];

  // Extract unique categories for filter
  const categories = ["All", "Hotel", ...Array.from(new Set(mockGallery.map((item) => item.cat)))];

  // Filter items based on selected tab
  const filteredItems = selectedCategory === "All"
    ? allItems
    : allItems.filter((item) => item.cat.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <PageShell>
      <PageHero
        eyebrow="Gallery"
        title="Visual Journey"
        subtitle="Step inside our boutique spaces and dining experiences."
        image={BRAND.galleryHeroImageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        {/* Category Filters */}
        <Reveal className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-gold text-white shadow-md shadow-gold/20"
                    : "bg-cream text-muted-foreground hover:text-foreground hover:bg-cream/80"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </Reveal>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border border-dashed rounded-2xl bg-cream/10">
            No gallery items found in this category.
          </div>
        ) : (
          <Reveal>
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filteredItems.map((item, idx) => (
                <div
                  key={idx}
                  className="break-inside-avoid overflow-hidden rounded-2xl border border-cream shadow-sm hover:shadow-lg transition-all duration-300 group relative"
                >
                  <img
                    src={item.src}
                    alt={item.desc || "Gallery Image"}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {item.desc ? (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex items-end">
                      <p className="text-white text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex items-end">
                      <span className="text-[10px] tracking-widest text-white/60 uppercase">{item.cat}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </section>
    </PageShell>
  );
}
