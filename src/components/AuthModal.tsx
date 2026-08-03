import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";
import { Sparkles } from "lucide-react";

export function AuthModal() {
  const { authOpen, setAuthOpen, login, signup, pending } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");

  const [li, setLi] = useState({ email: "", password: "" });
  const [su, setSu] = useState({ name: "", email: "", phone: "", password: "", confirm: "", terms: false });
  const [err, setErr] = useState<string | null>(null);

  return (
    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-cream to-transparent">
          <DialogHeader>
            <DialogTitle className="font-serif text-3xl">Sign in to continue</DialogTitle>
            <DialogDescription className="flex items-start gap-2 text-sm">
              <Sparkles className="h-4 w-4 mt-0.5 text-gold shrink-0" />
              <span>{pending ? `Just one step to ${pending.label.toLowerCase()}. ` : ""}Track your bookings, unlock member rates and enjoy faster checkout.</span>
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 pb-6">
          <Tabs value={tab} onValueChange={(v) => { setTab(v as "login" | "signup"); setErr(null); }}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="pt-4 space-y-3">
              <FloatingInput id="li-email" label="Email" type="email" value={li.email} onChange={(v) => setLi({ ...li, email: v })} />
              <FloatingInput id="li-pw" label="Password" type="password" value={li.password} onChange={(v) => setLi({ ...li, password: v })} />
              <div className="flex justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground"><Checkbox /> Remember me</label>
                <button className="text-gold hover:underline">Forgot password?</button>
              </div>
              {err && <p className="text-sm text-destructive">{err}</p>}
              <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90 gold-glow" onClick={async () => {
                if (!li.email || !li.password) return setErr("Please enter your email and password.");
                try {
                  setErr(null);
                  await login(li.email, li.password);
                } catch (e: any) {
                  setErr(e.message || "Failed to log in.");
                }
              }}>Sign in</Button>
              <p className="text-xs text-muted-foreground text-center pt-1">Bookings require an account — guest browsing is always free.</p>
            </TabsContent>
 
            <TabsContent value="signup" className="pt-4 space-y-3">
              <FloatingInput id="su-name" label="Full name" value={su.name} onChange={(v) => setSu({ ...su, name: v })} />
              <FloatingInput id="su-email" label="Email" type="email" value={su.email} onChange={(v) => setSu({ ...su, email: v })} />
              <FloatingInput id="su-phone" label="Phone" value={su.phone} onChange={(v) => setSu({ ...su, phone: v })} />
              <div className="grid grid-cols-2 gap-3">
                <FloatingInput id="su-pw" label="Password" type="password" value={su.password} onChange={(v) => setSu({ ...su, password: v })} />
                <FloatingInput id="su-cf" label="Confirm" type="password" value={su.confirm} onChange={(v) => setSu({ ...su, confirm: v })} />
              </div>
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <Checkbox checked={su.terms} onCheckedChange={(c) => setSu({ ...su, terms: !!c })} className="mt-0.5" />
                <span>I agree to the Terms of Service and Privacy Policy.</span>
              </label>
              {err && <p className="text-sm text-destructive">{err}</p>}
              <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90 gold-glow" onClick={async () => {
                if (!su.name || !su.email || !su.password) return setErr("Please fill in your name, email and password.");
                if (su.password !== su.confirm) return setErr("Passwords don't match.");
                if (!su.terms) return setErr("Please accept the terms to continue.");
                try {
                  setErr(null);
                  await signup(su);
                } catch (e: any) {
                  setErr(e.message || "Failed to create account.");
                }
              }}>Create account</Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FloatingInput({ id, label, value, onChange, type = "text" }: { id: string; label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="relative">
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="h-12 pt-4 peer" placeholder=" " />
      <Label htmlFor={id} className="absolute left-3 top-1 text-[10px] uppercase tracking-widest text-muted-foreground peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case transition-all pointer-events-none">
        {label}
      </Label>
    </div>
  );
}
