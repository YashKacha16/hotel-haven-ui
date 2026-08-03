import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { useBrand } from "@/lib/settings";

export function Footer() {
  const BRAND = useBrand();
  return (
    <footer className="bg-forest text-forest-foreground mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {BRAND.logoUrl ? (
              <img src={BRAND.logoUrl} alt="Logo" className="h-9 w-9 object-contain rounded-full bg-gold p-1" />
            ) : (
              <span className="h-9 w-9 rounded-full bg-gold text-forest grid place-items-center font-serif text-xl">{BRAND.name[0]?.toUpperCase() || "A"}</span>
            )}
            <span className="font-serif text-2xl">{BRAND.name}</span>
          </div>
          <p className="text-sm text-forest-foreground/70 leading-relaxed">{BRAND.tagline}</p>
          <div className="flex gap-3 mt-5">
            {[Instagram, Facebook, Twitter].map((I, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-full border border-forest-foreground/20 grid place-items-center hover:bg-gold hover:text-forest hover:border-gold transition"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-3 text-gold">Explore</h4>
          <ul className="space-y-2 text-sm text-forest-foreground/80">
            <li><Link to="/rooms">Rooms & Suites</Link></li>
            <li><Link to="/dining">Dining</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-3 text-gold">Visit</h4>
          <ul className="space-y-2 text-sm text-forest-foreground/80">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />{BRAND.address}</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" />{BRAND.phone}</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" />{BRAND.email}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-3 text-gold">Hours</h4>
          <ul className="space-y-2 text-sm text-forest-foreground/80">
            {BRAND.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4"><span>{h.day}</span><span className="text-forest-foreground/60">{h.time}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-forest-foreground/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 text-xs text-forest-foreground/60 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
          <span>Crafted with care on the Konkan coast.</span>
        </div>
      </div>
    </footer>
  );
}
