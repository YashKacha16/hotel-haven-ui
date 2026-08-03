# Hotel Haven UI

Create a stunning, premium, fully responsive customer-facing website UI for a hotel + restaurant brand 

called "[Your Hotel Name]" — UI ONLY, no backend logic, use realistic dummy data and beautiful sample 

imagery throughout. Build in React with Tailwind CSS. This should feel like a boutique 5-star hotel 

website — warm, inviting, elegant, trustworthy — NOT a generic booking template. Think Airbnb Luxe meets 

a fine-dining restaurant brand.

DESIGN LANGUAGE:

- Warm, upscale palette: ivory/cream base, deep forest-green or navy for contrast sections, rich 

  gold/copper accent for CTAs and highlights.

- Elegant serif font for headings/hotel name, clean modern sans-serif for body text.

- Large immersive hero imagery/video, generous whitespace, soft rounded corners, subtle parallax/scroll 

  animations, smooth fade-ins as sections come into view.

- Support Light and Dark mode toggle (dark mode: deep charcoal-green background, gold accents glowing 

  softly).

- Fully responsive: sticky header on scroll, mobile hamburger menu, touch-friendly carousels.

=== AUTHENTICATION GATE ===

- Users can freely BROWSE the entire site (home, rooms, menu, gallery, about) without logging in.

- The moment a user clicks "Book a Room", "Reserve a Table", or "Order Food" (any action button), 

  intercept with a beautiful modal: "Sign in to continue" with two tabs — Login and Sign Up.

- Sign Up form: full name, email, phone number, password, confirm password, small terms checkbox — 

  clean multi-field form with floating labels, subtle validation UI (dummy).

- Login form: email + password, "Forgot password" link, "Continue as Guest" is NOT allowed for booking 

  — must sign up/login first (guest browsing only, booking always requires account).

- After successful signup/login (simulated), modal closes and the user's original intended action 

  (booking room/table/food) resumes automatically exactly where they left off.

- Once logged in, header shows user avatar + name with a dropdown: "My Bookings", "My Orders", "Profile", 

  "Logout".

- Add a subtle "why sign up" reassurance line in the modal like "Track your bookings, get exclusive 

  offers, and enjoy faster checkout."

=== HEADER / NAVIGATION ===

- Logo left, nav links center (Home, Rooms, Dining, Gallery, About, Contact), right side: dark mode 

  toggle, "Book Now" prominent gold CTA button, user account icon.

- Sticky header that shrinks slightly on scroll with a subtle shadow.

- Mobile: hamburger drawer with same links + CTA at top.

=== 1) HOME PAGE ===

- Full-screen hero: background video/image of the hotel, elegant tagline, hotel name in large serif 

  font, two primary CTAs side by side: "Book a Room" and "Reserve a Table" (a third smaller link/button 

  "Order Food to Room" for in-house guests).

- "Welcome" story section: short brand narrative + image, elegant two-column layout.

- Featured Rooms carousel: 3-4 room cards (image, name, price/night, short tag like "Ocean View"), 

  "View All Rooms" link.

- "A Taste of Our Kitchen" section: food category tabs (Breakfast/Lunch/Dinner) with appetizing dish 

  images, "View Full Menu" button.

- Amenities strip: icon row (WiFi, Pool, Spa, Parking, Restaurant, Gym, Room Service, Airport Pickup).

- Guest testimonials carousel with star ratings and photos.

- Instagram-style gallery grid (hotel + food + rooms + events).

- Newsletter signup band with elegant background.

- Footer: contact info, address, embedded map placeholder, social icons, quick links, opening hours.

=== 2) ROOMS PAGE + BOOK A ROOM FLOW ===

- Filter/search bar at top: check-in date, check-out date, number of guests, room category dropdown, 

  price range slider — "Search Availability" button.

- Grid of room cards: image carousel per card, name, category badge, price/night, key amenities icons, 

  short description, "View Details" and "Book Now" buttons.

- Room Details modal/page: full image gallery, detailed description, complete amenities list, guest 

  reviews for that room type, price breakdown calculator (updates live based on selected dates/nights), 

  "Book This Room" button.

BOOK A ROOM — Multi-step flow (triggers auth gate if not logged in):

  Step 1: Confirm dates (check-in/check-out calendar picker), number of guests, number of rooms.

  Step 2: Guest details form (auto-filled if logged in: name, email, phone; add special requests field 

    — "Early check-in", "Extra bed", "Anniversary setup" etc.)

  Step 3: Review & Pay — booking summary card (room, dates, nights, price breakdown: room rate x nights 

    + taxes + service fee = total), dummy payment method selection (Card/UPI/Pay at Hotel), "Confirm 

    Booking" button.

  Step 4: Confirmation screen — success animation/checkmark, booking ID, full summary card, "Add to 

    Calendar" button (UI only), "View My Bookings" link.

=== 3) DINING PAGE + RESERVE A TABLE FLOW ===

- Full menu displayed beautifully: category tabs or elegant accordion (Starters, Main Course, 

  Beverages, Desserts, Specials) — each item card with appetizing image, name, price, veg/non-veg 

  indicator, short description, dietary tags (Spicy, Gluten-free, Chef's Special badge where relevant).

- "Reserve a Table" section (prominent, its own card/banner on this page):

  - Date picker, time slot selector (visual time chips: 12:00 PM, 12:30 PM... shown as available/full), 

    number of guests stepper, seating preference (Indoor/Outdoor/AC/Private/Window), special occasion 

    dropdown (Birthday/Anniversary/Business/Casual — enables a small decor note), special requests text 

    field.

  - "Reserve Table" button (triggers auth gate if not logged in).

  - On confirm: Confirmation screen — reservation ID, summary card (date, time, party size, table 

    preference), "Add to Calendar" button, "View My Reservations" link.

- Live-ish availability indicator per time slot (color dot: green=plenty available, amber=limited, 

  red=full) for realism.

=== 4) ORDER FOOD FLOW (for in-house hotel guests — Room Service) ===

- Accessible via header link "Order Food" or from "My Bookings" if user has an active room booking.

- If user has an active/upcoming room booking (dummy logic): shows "Order to Room [number]" directly.

- If no active booking: shows a friendly prompt — "Order food is available for in-house guests. Book 

  a room or select an existing reservation to continue" with a "Book a Room" shortcut button.

- Menu browsing UI (same elegant category tabs/cards as Dining page) with "Add to Order" quantity 

  stepper per item.

- Sticky cart panel (side panel on desktop, bottom sheet on mobile): selected items, quantities, 

  special instructions field, subtotal, estimated delivery time to room, "Place Order" button.

- Order confirmation screen: order ID, ETA to room, summary of items, "Track Order" button leading to 

  a simple status tracker UI (Order Placed → Preparing → On the Way → Delivered) with progress bar/steps.

=== 5) MY ACCOUNT AREA (post-login) ===

- "My Bookings" tab: cards for room bookings and table reservations, tabs for Upcoming / Completed / 

  Cancelled, each card shows status badge, details, "Cancel Booking" (with policy note shown, e.g., 

  "Free cancellation until [date]") and "View Details" buttons.

- "My Orders" tab: past and active room-service orders with status, reorder button.

- "Profile" tab: edit name/phone/email, saved payment methods (dummy), preferences (dietary, room 

  preference).

=== 6) GALLERY PAGE ===

- Masonry-style image grid: rooms, restaurant ambiance, events, food close-ups — filterable by category 

  tabs (Rooms/Dining/Events/Exterior).

=== 7) ABOUT PAGE ===

- Brand story, founder/chef spotlight, awards/recognitions strip, values section with elegant icons.

=== 8) CONTACT PAGE ===

- Elegant contact form, embedded map placeholder, address, phone, email, opening hours table, quick 

  WhatsApp/Call buttons.

=== EXTRA POLISH ===

- Smooth scroll-reveal animations throughout (fade-up on scroll).

- Hover effects: image zoom on room/food cards, button lift/glow on CTAs.

- Loading skeletons for room/menu grids.

- Toast notifications for actions ("Reservation confirmed!", "Item added to cart", "Booking cancelled").

- Trust badges/strip near booking sections ("Best Price Guarantee", "Free Cancellation", "24/7 Support").

- Make the entire experience feel warm, premium, and trustworthy — like booking directly with a 

  beloved boutique hotel, not a generic listing site.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f1c1d69e-0045-43c8-a834-cd4e7e711a76).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
