import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, MessageCircle, MapPin, Mail, Star } from "lucide-react";
import { toast } from "sonner";
import { useBrand } from "@/lib/settings";
import { PageShell, PageHero } from "@/components/PageShell";
import { Reveal } from "@/lib/reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Feedback & Contact" },
      { name: "description", content: "Share your feedback, reviews, and get in touch with us." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const brand = useBrand();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  const fetchFeedbacks = () => {
    fetch("https://hotel-backend.runasp.net/api/Feedbacks")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((f: any) => ({
            id: f.id || f.Id,
            name: f.name || f.Name,
            city: f.city || f.City || "Guest",
            rating: f.rating || f.Rating || 5,
            text: f.comment || f.Comment || "",
            avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`
          }));
          setReviewsList(mapped);
        }
      })
      .catch(() => { });
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      toast.error("Please enter your name and feedback message.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("https://hotel-backend.runasp.net/api/Feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          city: city.trim() || "Guest",
          rating,
          comment: text.trim()
        })
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback.");
      }

      toast.success("Thank you! Your feedback has been recorded.");
      setName("");
      setCity("");
      setRating(5);
      setText("");
      fetchFeedbacks();
    } catch {
      toast.error("Could not submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Feedback & Contact"
        title="Share your experience"
        subtitle="We value your feedback and answer every note personally."
        image={brand.contactHeroImageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"}
      />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-8">
        {/* FEEDBACK FORM */}
        <Reveal>
          <Card className="p-8 border-0 shadow-sm bg-cream/40">
            <h2 className="font-serif text-3xl">Feedback Form</h2>
            <p className="text-xs text-muted-foreground mt-1 mb-6">Tell us about your stay or dining experience.</p>

            <form className="space-y-4" onSubmit={handleSubmitFeedback}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Your Name</Label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya R."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">City / Location</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Rating</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${star <= rating ? "fill-gold text-gold" : "text-muted-foreground/30"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Your Feedback</Label>
                <Textarea
                  required
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your thoughts about your experience with us..."
                  className="mt-1"
                />
              </div>

              <Button type="submit" disabled={submitting} className="bg-gold text-gold-foreground hover:bg-gold/90 w-full h-11">
                {submitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </Card>
        </Reveal>

        {/* CONTACT INFO */}
        <Reveal delay={120}>
          <div className="space-y-4">
            <Card className="p-6 border-0 shadow-sm bg-cream/40 space-y-3 text-sm">
              <div className="flex gap-3"><MapPin className="h-4 w-4 mt-0.5 text-gold" />{brand.address}</div>
              <div className="flex gap-3"><Phone className="h-4 w-4 mt-0.5 text-gold" />{brand.phone}</div>
              <div className="flex gap-3"><Mail className="h-4 w-4 mt-0.5 text-gold" />{brand.email}</div>
            </Card>
            <Card className="p-6 border-0 shadow-sm bg-cream/40">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Opening Hours</div>
              <table className="w-full text-sm">
                <tbody>
                  {brand.hours.map((h) => (
                    <tr key={h.day} className="border-b border-border/50 last:border-0">
                      <td className="py-2">{h.day}</td>
                      <td className="py-2 text-right text-muted-foreground">{h.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <a href={`tel:${brand.phone.replace(/\s/g, "")}`}>
                <Button variant="outline" className="w-full"><Phone className="h-4 w-4 mr-2" />Call</Button>
              </a>
              <a href="https://wa.me/919820012345">
                <Button variant="outline" className="w-full"><MessageCircle className="h-4 w-4 mr-2" />WhatsApp</Button>
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FEEDBACK & REVIEWS LIST */}
      {reviewsList.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
          <Reveal className="text-center mb-10">
            <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Loved by Guests</div>
            <h2 className="font-serif text-4xl sm:text-5xl">Stories from our stay</h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {reviewsList.map((rev, i) => (
              <Reveal key={rev.id || i} delay={i * 60}>
                <Card className="p-6 border-0 shadow-sm bg-cream/40 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 text-gold mb-4">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-4 w-4 ${idx < rev.rating ? "fill-gold text-gold" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm italic text-foreground/90 leading-relaxed">"{rev.text}"</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="font-serif font-medium text-sm">{rev.name}</div>
                    {rev.city && <div className="text-xs text-muted-foreground">{rev.city}</div>}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
