import type { ReactNode } from "react";

export function PageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <main className={`pt-24 ${className}`}>{children}</main>;
}

export function PageHero({ eyebrow, title, subtitle, image }: { eyebrow?: string; title: string; subtitle?: string; image: string }) {
  return (
    <section className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-background/80" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 text-white">
        {eyebrow && <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">{eyebrow}</div>}
        <h1 className="font-serif text-4xl sm:text-6xl text-balance">{title}</h1>
        {subtitle && <p className="mt-3 max-w-xl text-white/80">{subtitle}</p>}
      </div>
    </section>
  );
}
