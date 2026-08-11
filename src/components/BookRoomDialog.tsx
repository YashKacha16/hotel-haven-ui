import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Check, CalendarPlus, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { rooms as roomsType } from "@/lib/data";

type Room = (typeof roomsType)[number];
type Props = { room: Room | null; open: boolean; onOpenChange: (v: boolean) => void };

export function BookRoomDialog({ room, open, onOpenChange }: Props) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [rms, setRms] = useState(1);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [notes, setNotes] = useState("");
  const [pay, setPay] = useState("card");
  const [bookingId] = useState(() => "MA-" + Math.floor(100000 + Math.random() * 900000));

  if (!room) return null;

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : 1;
  const base = room.price * nights * rms;
  const taxes = Math.round(base * 0.12);
  const fee = 400;
  const total = base + taxes + fee;

  const reset = () => { setStep(1); onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setStep(1); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {step === 4 ? "Reservation confirmed" : `Book · ${room.name}`}
          </DialogTitle>
          {step < 4 && (
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-gold" : "bg-muted"}`} />
              ))}
            </div>
          )}
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Check-in"><Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></Field>
              <Field label="Check-out"><Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></Field>
              <Field label="Guests"><Input type="number" min={1} value={guests} onChange={(e) => setGuests(+e.target.value)} /></Field>
              <Field label="Rooms"><Input type="number" min={1} value={rms} onChange={(e) => setRms(+e.target.value)} /></Field>
            </div>
            <Summary room={room} nights={nights} base={base} taxes={taxes} fee={fee} total={total} rms={rms} />
            <NextButtons onNext={() => setStep(2)} disableNext={!checkIn || !checkOut} />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
              <Field label="Email"><Input value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
              <Field label="Phone" className="sm:col-span-2"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
              <Field label="Special requests" className="sm:col-span-2"><Textarea rows={3} placeholder="Early check-in, extra bed, anniversary setup…" value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
            </div>
            <NextButtons onBack={() => setStep(1)} onNext={() => setStep(3)} />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <Summary room={room} nights={nights} base={base} taxes={taxes} fee={fee} total={total} rms={rms} />
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Payment method</Label>
              <RadioGroup value={pay} onValueChange={setPay} className="grid grid-cols-3 gap-2 mt-2">
                {[["card", "Card"], ["upi", "UPI"], ["hotel", "Pay at Hotel"]].map(([v, l]) => (
                  <label key={v} className={`border rounded-lg px-3 py-3 cursor-pointer text-sm flex items-center gap-2 ${pay === v ? "border-gold bg-accent" : "border-border"}`}>
                    <RadioGroupItem value={v} />{l}
                  </label>
                ))}
              </RadioGroup>
            </div>
            <NextButtons onBack={() => setStep(2)} onNext={async () => {
              try {
                // Fetch rooms from backend to map to a real room Id
                const roomsRes = await fetch("https://hotel-backend.runasp.net//api/Rooms");
                let matchedRoomId = 1;
                if (roomsRes.ok) {
                  const roomsList = await roomsRes.json();
                  const matched = roomsList.find((r: any) => r.category?.name?.toLowerCase() === room.category.toLowerCase())
                    || roomsList.find((r: any) => r.category?.name)
                    || roomsList[0];
                  if (matched) {
                    matchedRoomId = matched.id;
                  }
                }

                const fd = new FormData();
                fd.append("GuestName", name);
                fd.append("Phone", phone);
                fd.append("Email", email);
                fd.append("IdNumber", "ID-" + Math.floor(100000 + Math.random() * 900000));
                fd.append("RoomId", matchedRoomId.toString());
                fd.append("CheckInDate", checkIn);
                fd.append("CheckInTime", "14:00");
                fd.append("CheckOutDate", checkOut);
                fd.append("Source", "Online");
                fd.append("Guests", guests.toString());
                fd.append("AdvanceAmount", "0");
                fd.append("PaymentMethod", pay);
                fd.append("Status", "Confirmed");

                const res = await fetch("https://hotel-backend.runasp.net//api/Bookings", {
                  method: "POST",
                  body: fd
                });

                if (!res.ok) {
                  const errData = await res.json().catch(() => ({}));
                  throw new Error(errData.message || "Failed to confirm booking.");
                }

                const resData = await res.json();
                toast.success("Reservation confirmed!", { description: `Booking Code: ${resData.bookingCode}` });
                setStep(4);
              } catch (e: any) {
                toast.error(e.message || "Something went wrong.");
              }
            }} nextLabel="Confirm booking" />
          </div>
        )}
        {step === 4 && (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-gold/20 grid place-items-center animate-in zoom-in duration-500">
              <Check className="h-8 w-8 text-gold" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Booking ID</div>
              <div className="font-serif text-3xl">{bookingId}</div>
            </div>
            <div className="text-left border border-border rounded-xl p-4 bg-cream/40">
              <Summary room={room} nights={nights} base={base} taxes={taxes} fee={fee} total={total} rms={rms} />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline"><CalendarPlus className="h-4 w-4 mr-2" />Add to calendar</Button>
              <Button onClick={reset} className="bg-gold text-gold-foreground hover:bg-gold/90">Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
function NextButtons({ onBack, onNext, nextLabel = "Continue", disableNext }: { onBack?: () => void; onNext: () => void; nextLabel?: string; disableNext?: boolean }) {
  return (
    <div className="flex justify-between pt-2">
      {onBack ? <Button variant="ghost" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" />Back</Button> : <span />}
      <Button onClick={onNext} disabled={disableNext} className="bg-gold text-gold-foreground hover:bg-gold/90">{nextLabel}<ArrowRight className="h-4 w-4 ml-1" /></Button>
    </div>
  );
}
function Summary({ room, nights, base, taxes, fee, total, rms }: { room: any; nights: number; base: number; taxes: number; fee: number; total: number; rms: number }) {
  return (
    <div className="border border-border rounded-xl p-4 text-sm bg-cream/40 space-y-1.5">
      <div className="flex justify-between"><span className="text-muted-foreground">Room</span><span>{room.name} × {rms}</span></div>
      <div className="flex justify-between"><span className="text-muted-foreground">Nights</span><span>{nights}</span></div>
      <div className="flex justify-between"><span className="text-muted-foreground">Room rate ({rms} × {nights})</span><span>₹{base.toLocaleString()}</span></div>
      <div className="flex justify-between"><span className="text-muted-foreground">Taxes (12%)</span><span>₹{taxes.toLocaleString()}</span></div>
      <div className="flex justify-between"><span className="text-muted-foreground">Service fee</span><span>₹{fee.toLocaleString()}</span></div>
      <div className="flex justify-between pt-2 border-t border-border font-serif text-lg"><span>Total</span><span className="text-gold">₹{total.toLocaleString()}</span></div>
    </div>
  );
}
