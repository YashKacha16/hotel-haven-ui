import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Moon, Sun, User, LogOut, Calendar, ShoppingBag, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { useBrand } from "@/lib/settings";

const nav = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Rooms" },
  { to: "/dining", label: "Dining" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();
  const { user, logout, requireAuth } = useAuth();
  const navigate = useNavigate();
  const BRAND = useBrand();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bookNow = () => requireAuth("Book a room", () => navigate({ to: "/rooms" }));

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? "bg-background/85 backdrop-blur-md border-b border-border shadow-sm py-2" : "bg-transparent py-4"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          {BRAND.logoUrl ? (
            <div className="h-9 w-9 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-md" style={{ backgroundColor: BRAND.logoBackgroundColor || '#070e17', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}>
              <img src={BRAND.logoUrl} alt="Logo" className="h-full w-full object-contain p-1" />
            </div>
          ) : (
            <span className="h-9 w-9 rounded-full text-gold grid place-items-center font-serif text-xl shadow-md" style={{ backgroundColor: BRAND.logoBackgroundColor || '#070e17' }}>{BRAND.name[0]?.toUpperCase() || "A"}</span>
          )}
          <span className="font-serif text-xl sm:text-2xl leading-none">{BRAND.name}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm tracking-wide text-foreground/80 hover:text-foreground transition-colors relative [&.active]:text-gold" activeProps={{ className: "active" }}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button onClick={bookNow} className="hidden sm:inline-flex bg-gold text-gold-foreground hover:bg-gold/90 gold-glow">Book Now</Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full hover:bg-accent px-2 py-1 transition">
                  <Avatar className="h-8 w-8"><AvatarFallback className="bg-forest text-gold text-xs">{user.name.split(" ").map((s) => s[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
                  <span className="hidden md:inline text-sm">{user.name.split(" ")[0]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal"><div className="font-serif text-base">{user.name}</div><div className="text-xs text-muted-foreground">{user.email}</div></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate({ to: "/account", search: { tab: "bookings" } })}><Calendar className="h-4 w-4 mr-2" />My Bookings</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate({ to: "/account", search: { tab: "orders" } })}><ShoppingBag className="h-4 w-4 mr-2" />My Orders</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate({ to: "/account", search: { tab: "profile" } })}><Settings className="h-4 w-4 mr-2" />Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={logout}><LogOut className="h-4 w-4 mr-2" />Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => requireAuth("Sign in", () => {})} aria-label="Account"><User className="h-4 w-4" /></Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="font-serif text-2xl">{BRAND.name}</SheetTitle>
              <Button onClick={bookNow} className="w-full bg-gold text-gold-foreground hover:bg-gold/90 mt-4">Book Now</Button>
              <nav className="mt-6 flex flex-col gap-1">
                {nav.map((n) => (
                  <Link key={n.to} to={n.to} className="py-3 px-3 rounded-md hover:bg-accent text-base [&.active]:text-gold [&.active]:bg-accent" activeProps={{ className: "active" }}>{n.label}</Link>
                ))}
                <Link to="/order" className="py-3 px-3 rounded-md hover:bg-accent text-base">Order Food</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
