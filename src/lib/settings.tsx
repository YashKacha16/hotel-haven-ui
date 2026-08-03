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
  name: "Maison Auréa",
  address: "12 Coral Cove, Alibaug, Maharashtra 402201",
  phone: "+91 98200 12345",
  email: "reservations@maisonaurea.com",
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
    fetch("http://localhost:5157/api/Settings/general")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data && (data.name || data.Name)) {
          setBrand({
            name: data.name || data.Name || defaultBrand.name,
            tagline: defaultBrand.tagline, 
            address: data.address || data.Address || defaultBrand.address,
            phone: data.phone || data.Phone || defaultBrand.phone,
            email: data.email || data.Email || defaultBrand.email,
            logoUrl: (data.logoUrl || data.LogoUrl) ? `http://localhost:5157${data.logoUrl || data.LogoUrl}` : undefined,
            welcomeImageUrl: (data.welcomeImageUrl || data.WelcomeImageUrl) ? `http://localhost:5157${data.welcomeImageUrl || data.WelcomeImageUrl}` : undefined,
            aboutText: data.aboutText || data.AboutText || undefined,
            chefName: data.chefName || data.ChefName || undefined,
            chefDescription: data.chefDescription || data.ChefDescription || undefined,
            chefImageUrl: (data.chefImageUrl || data.ChefImageUrl) ? `http://localhost:5157${data.chefImageUrl || data.ChefImageUrl}` : undefined,
            hours: defaultBrand.hours,
          });
        }
      })
      .catch(() => { });
  }, []);

  return <SettingsContext.Provider value={brand}>{children}</SettingsContext.Provider>;
}

export const useBrand = () => useContext(SettingsContext);
