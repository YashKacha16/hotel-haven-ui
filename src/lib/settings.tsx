import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type BrandSettings = {
  name: string;
  tagline?: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  welcomeImageUrl?: string;
  aboutText?: string;
  chefName?: string;
  chefDescription?: string;
  chefImageUrl?: string;
  hours: { day: string; time: string }[];
};

const defaultBrand: BrandSettings = {
  name: "",
  address: "",
  phone: "",
  email: "",
  hours: [
    { day: "Reception", time: "24 hours" },
    { day: "Restaurant — Breakfast", time: "7:00 – 11:00" },
    { day: "Restaurant — Lunch", time: "12:30 – 15:30" },
    { day: "Restaurant — Dinner", time: "19:00 – 23:00" },
  ],
};

const SettingsContext = createContext<BrandSettings>(defaultBrand);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<BrandSettings>(defaultBrand);

  useEffect(() => {
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
            logoUrl: (data.logoUrl || data.LogoUrl) ? `http://localhost:5157${data.logoUrl || data.LogoUrl}` : undefined,
            welcomeImageUrl: (data.welcomeImageUrl || data.WelcomeImageUrl) ? `http://localhost:5157${data.welcomeImageUrl || data.WelcomeImageUrl}` : undefined,
            aboutText: data.aboutText || data.AboutText || "",
            chefName: data.chefName || data.ChefName || "",
            chefDescription: data.chefDescription || data.ChefDescription || "",
            chefImageUrl: (data.chefImageUrl || data.ChefImageUrl) ? `http://localhost:5157${data.chefImageUrl || data.ChefImageUrl}` : undefined,
            hours: defaultBrand.hours,
          });
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (!brand.name) return;

    const realName = brand.name;

    const updateTitle = () => {
      if (/Maison Aur[eé]a/gi.test(document.title)) {
        document.title = document.title.replace(/Maison Aur[eé]a/gi, realName);
      } else if (/Maison/gi.test(document.title)) {
        document.title = document.title.replace(/Maison/gi, realName);
      } else if (document.title.includes("Hotel —")) {
        document.title = document.title.replace("Hotel —", `${realName} —`);
      } else if (document.title.endsWith("— Hotel")) {
        document.title = document.title.replace("— Hotel", `— ${realName}`);
      } else if (!document.title.toLowerCase().includes(realName.toLowerCase())) {
        document.title = `${realName} — Boutique Hotel & Restaurant`;
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
