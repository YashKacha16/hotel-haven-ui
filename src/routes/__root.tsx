import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "../lib/theme";
import { AuthProvider } from "../lib/auth";
import { BrandProvider } from "../lib/settings";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AuthModal } from "../components/AuthModal";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl">404</h1>
        <p className="mt-4 text-muted-foreground">This page has checked out. Let's get you home.</p>
        <a href="/" className="inline-flex mt-6 items-center rounded-md bg-gold text-gold-foreground px-4 py-2 text-sm">Return home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again in a moment.</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-md bg-gold text-gold-foreground px-4 py-2 text-sm">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Maison Auréa — Boutique Hotel & Restaurant" },
      { name: "description", content: "A boutique 5-star retreat and coastal fine-dining restaurant on the Konkan coast." },
      { name: "author", content: "Maison Auréa" },
      { property: "og:title", content: "Maison Auréa — Boutique Hotel & Restaurant" },
      { property: "og:description", content: "A boutique 5-star retreat and coastal fine-dining restaurant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrandProvider>
          <AuthProvider>
            <Header />
            <Outlet />
            <Footer />
            <AuthModal />
            <Toaster position="top-center" />
          </AuthProvider>
        </BrandProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
