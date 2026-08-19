import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type BrandSettings = {
  name: string;
  tagline?: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  logoBackgroundColor?: string;
  welcomeImageUrl?: string;
  heroImageUrl?: string;
  roomsHeroImageUrl?: string;
  diningHeroImageUrl?: string;
  aboutHeroImageUrl?: string;
  contactHeroImageUrl?: string;
  galleryHeroImageUrl?: string;
  aboutText?: string;
  chefName?: string;
  chefDescription?: string;
  chefImageUrl?: string;
  hours: { day: string; time: string }[];
  hotelAmenities?: string[];
};

const defaultBrand: BrandSettings = {
  name: "",
  address: "",
  phone: "",
  email: "",
  hotelAmenities: ["WiFi", "AC", "TV", "Balcony", "Minibar", "Bathtub"],
    hours: [
    { day: "Reception", time: "24 hours" },
    { day: "Restaurant - Breakfast", time: "7:00 - 11:00" },
    { day: "Restaurant - Lunch", time: "12:30 - 15:30" },
    { day: "Restaurant - Dinner", time: "19:00 - 23:00" },
  ],
};

const SettingsContext = createContext<BrandSettings>(defaultBrand);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<BrandSettings>(defaultBrand);

  useEffect(() => {
    const resolveUrl = (path?: string) => {
      if (!path) return undefined;
      if (path.startsWith("http")) return path;
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `https://hotel-backend.runasp.net${cleanPath}`;
    };

    fetch("https://hotel-backend.runasp.net/api/Settings/general")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data) {
          setBrand({
            name: data.name || data.Name || "",
            tagline: data.tagline || data.Tagline || "",
            address: data.address || data.Address || "",
            phone: data.phone || data.Phone || "",
            email: data.email || data.Email || "",
            logoUrl: resolveUrl(data.logoUrl || data.LogoUrl),
            logoBackgroundColor: data.logoBackgroundColor || data.LogoBackgroundColor || undefined,
            welcomeImageUrl: resolveUrl(data.welcomeImageUrl || data.WelcomeImageUrl),
            heroImageUrl: resolveUrl(data.heroImageUrl || data.HeroImageUrl),
            roomsHeroImageUrl: resolveUrl(data.roomsHeroImageUrl || data.RoomsHeroImageUrl),
            diningHeroImageUrl: resolveUrl(data.diningHeroImageUrl || data.DiningHeroImageUrl),
            aboutHeroImageUrl: resolveUrl(data.aboutHeroImageUrl || data.AboutHeroImageUrl),
            contactHeroImageUrl: resolveUrl(data.contactHeroImageUrl || data.ContactHeroImageUrl),
            galleryHeroImageUrl: resolveUrl(data.galleryHeroImageUrl || data.GalleryHeroImageUrl),
            aboutText: data.aboutText || data.AboutText || "",
            chefName: data.chefName || data.ChefName || "",
            chefDescription: data.chefDescription || data.ChefDescription || "",
            chefImageUrl: resolveUrl(data.chefImageUrl || data.ChefImageUrl),
            hotelAmenities: data.hotelAmenities || data.HotelAmenities || defaultBrand.hotelAmenities,
            hours: (() => {
              const rawHours = data.hotelHours || data.HotelHours;
              if (rawHours && rawHours.length > 0) {
                return rawHours.map((hStr: string) => {
                  const parts = hStr.split('|');
                  return { day: parts[0] || "", time: parts[1] || "" };
                });
              }
              return defaultBrand.hours;
            })(),
          });
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (!brand.name) return;

    const realName = brand.name;

        const updateTitle = () => {
      if (/Maison Aur[eAc]a/gi.test(document.title)) {
        document.title = document.title.replace(/Maison Aur[eAc]a/gi, realName);
      } else if (/Maison/gi.test(document.title)) {
        document.title = document.title.replace(/Maison/gi, realName);
      } else if (document.title.includes("Hotel -")) {
        document.title = document.title.replace("Hotel -", `${realName} -`);
      } else if (document.title.endsWith("- Hotel")) {
        document.title = document.title.replace("- Hotel", `- ${realName}`);
      } else if (!document.title.toLowerCase().includes(realName.toLowerCase())) {
        document.title = `${realName} - Boutique Hotel & Restaurant`;
      }
    };

    updateTitle();

    const titleEl = document.querySelector("title");
    if (!titleEl) return;

    const observer = new MutationObserver(() => {
      updateTitle();
    });

    observer.observe(titleEl, { childList: true, characterData: true, subtree: true });

    return () => observer.disconnect();
  }, [brand.name]);

  return <SettingsContext.Provider value={brand}>{children}</SettingsContext.Provider>;
}

export const useBrand = () => useContext(SettingsContext);
