import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useBrand } from "@/lib/settings";
import { Reveal } from "@/lib/reveal";
import { gallery as mockGallery } from "@/lib/data";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
          }));
          setBackendItems(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Combine backend items with default mock gallery items
  const allItems = [...backendItems, ...mockGallery.map(m => ({ ...m, src: m.src, desc: m.cat }))];

  // Extract unique categories for filter
  const categories = ["All", "Hotel", ...Array.from(new Set(mockGallery.map((item) => item.cat)))];

  // Filter items based on selected tab
  const filteredItems = selectedCategory === "All"
    ? allItems
    : allItems.filter((item) => item.cat.toLowerCase() === selectedCategory.toLowerCase());

  // Lightbox navigation
  const showNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
  }, [lightboxIndex, filteredItems.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
  }, [lightboxIndex, filteredItems.length]);

  // Handle keyboard events in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, showNext, showPrev]);

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
                onClick={() => {
                  setSelectedCategory(cat);
                  setLightboxIndex(null); // Reset lightbox to avoid index out of bounds
                }}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative overflow-hidden rounded-2xl border border-cream shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-cream/5 aspect-[4/3]"
                >
                  <img
                    src={item.src}
                    alt={item.desc || "Gallery Image"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  
                  {/* Subtle Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  {/* Hover Category & Description */}
                  <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex flex-col justify-end text-white">
                    <span className="text-[9px] tracking-widest text-gold uppercase font-semibold mb-1">
                      {item.cat}
                    </span>
                    <p className="text-xs leading-relaxed line-clamp-2 text-white/90">
                      {item.desc || "View details"}
                    </p>
                  </div>

                  {/* Zoom indicator on top right */}
                  <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 text-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 className="size-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </section>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300 animate-fadeIn">
          {/* Top Actions */}
          <div className="absolute top-4 inset-x-4 flex justify-between items-center text-white/80 z-50">
            <div className="text-xs tracking-widest uppercase">
              {filteredItems[lightboxIndex].cat} ({lightboxIndex + 1} / {filteredItems.length})
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            onClick={showPrev}
            className="absolute left-4 p-3 rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/15 transition-all z-50"
            aria-label="Previous Image"
          >
            <ChevronLeft className="size-6" />
          </button>

          {/* Image Container */}
          <div className="relative max-w-5xl max-h-[75vh] w-full px-12 flex justify-center items-center">
            <img
              src={filteredItems[lightboxIndex].src}
              alt={filteredItems[lightboxIndex].desc}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl select-none animate-scaleIn"
            />
          </div>

          {/* Right Arrow */}
          <button
            onClick={showNext}
            className="absolute right-4 p-3 rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/15 transition-all z-50"
            aria-label="Next Image"
          >
            <ChevronRight className="size-6" />
          </button>

          {/* Description Overlay at bottom */}
          <div className="absolute bottom-6 max-w-2xl px-6 text-center text-white/90">
            <p className="text-sm md:text-base leading-relaxed italic">
              "{filteredItems[lightboxIndex].desc || "Boutique Experience"}"
            </p>
          </div>
        </div>
      )}
    </PageShell>
  );
}
