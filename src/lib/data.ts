// Realistic dummy data for the hotel + restaurant brand.
export const BRAND = {
  name: "Maison Auréa",
  tagline: "A boutique retreat where hospitality is an art.",
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

export const IMG = {
  hero: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80",
  welcome: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
  chef: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=80",
  founder: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80",
};

export const rooms = [
  { id: "r1", name: "Garden Suite", category: "Suite", price: 14800, tag: "Garden View", size: "48 m²", beds: "King bed", images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"], amenities: ["WiFi","AC","Minibar","Balcony","Tea/Coffee"], description: "A sunlit suite opening onto our fragrant frangipani garden, with hand-block prints and a deep soaking tub." },
  { id: "r2", name: "Ocean Deluxe", category: "Deluxe", price: 18500, tag: "Ocean View", size: "42 m²", beds: "King bed", images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"], amenities: ["WiFi","AC","Sea Balcony","Bath tub","Butler"], description: "Wake to the sound of waves in a bright, breezy room with a private terrace facing the Arabian Sea." },
  { id: "r3", name: "Heritage Room", category: "Standard", price: 9800, tag: "Courtyard", size: "32 m²", beds: "Queen bed", images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"], amenities: ["WiFi","AC","Rain shower","Desk"], description: "Restored teak floors, antique writing desk and a private view of the century-old inner courtyard." },
  { id: "r4", name: "Aurea Villa", category: "Villa", price: 32000, tag: "Private Pool", size: "110 m²", beds: "King + Sofa", images: ["https://images.unsplash.com/photo-1587985064135-0366536eab42?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80"], amenities: ["Pool","Butler","Living room","Outdoor shower","Kitchenette"], description: "Our flagship two-bedroom villa with private plunge pool, sun deck and dedicated butler service." },
  { id: "r5", name: "Loft Studio", category: "Deluxe", price: 12400, tag: "Rooftop", size: "38 m²", beds: "King bed", images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"], amenities: ["WiFi","AC","Skylight","Espresso"], description: "A romantic top-floor loft with skylight, freestanding tub and views over the mango grove." },
  { id: "r6", name: "Family Cottage", category: "Cottage", price: 21000, tag: "Two bedrooms", size: "72 m²", beds: "Two Queens", images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"], amenities: ["WiFi","AC","Living room","Kids kit"], description: "A stand-alone cottage with two bedrooms, a shared living room and its own hammock verandah." },
];

export const reviews = [
  { name: "Ananya R.", city: "Mumbai", rating: 5, text: "The most soulful stay we've had in years. The staff remembered our anniversary — real, unforced warmth.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
  { name: "Rohan M.", city: "Bengaluru", rating: 5, text: "Chef's tasting menu was a highlight. Every dish told a story. Rooms are pure, quiet luxury.", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80" },
  { name: "Priya S.", city: "Delhi", rating: 5, text: "Booking was seamless and check-in felt like arriving at a friend's home. Will be back every monsoon.", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=200&q=80" },
];

export const menu = {
  Starters: [
    { name: "Charred Aubergine Bharta", price: 480, veg: true, tags: ["Chef's Special"], desc: "Smoked mash, house yoghurt, sourdough naan.", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" },
    { name: "Kerala Prawn Balchão", price: 720, veg: false, tags: ["Spicy"], desc: "Tiger prawns, curry leaf oil, toasted rice.", img: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=800&q=80" },
    { name: "Beetroot Carpaccio", price: 520, veg: true, tags: ["Gluten-free"], desc: "Roasted golden beet, orange, pistachio dukkah.", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80" },
  ],
  "Main Course": [
    { name: "Coastal Fish Curry", price: 980, veg: false, tags: ["Signature"], desc: "Line-caught pomfret, coconut, kokum, red rice.", img: "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&q=80" },
    { name: "Wild Mushroom Risotto", price: 860, veg: true, tags: [], desc: "Aged carnaroli, morels, brown butter, parmesan.", img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80" },
    { name: "Slow-Braised Lamb Nihari", price: 1180, veg: false, tags: ["Chef's Special"], desc: "Twelve-hour lamb shank, saffron pilaf, mint chutney.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" },
    { name: "Truffle Khichdi", price: 940, veg: true, tags: ["Gluten-free"], desc: "Aged rice, moong dal, fresh black truffle.", img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80" },
  ],
  Desserts: [
    { name: "Rose & Cardamom Kulfi", price: 380, veg: true, tags: [], desc: "Slow-reduced milk, dried rose, pistachio.", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80" },
    { name: "Dark Chocolate Fondant", price: 460, veg: true, tags: ["Chef's Special"], desc: "70% single-origin, salted caramel, vanilla ice.", img: "https://images.unsplash.com/photo-1541599188778-cdc73298e8fd?auto=format&fit=crop&w=800&q=80" },
  ],
  Beverages: [
    { name: "Curry Leaf Gimlet", price: 620, veg: true, tags: [], desc: "Gin, curry leaf cordial, lime, black pepper.", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80" },
    { name: "Masala Cold Brew", price: 320, veg: true, tags: [], desc: "18-hour cold brew, jaggery, warm spices.", img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80" },
    { name: "Estate Darjeeling", price: 260, veg: true, tags: [], desc: "First-flush Makaibari, loose leaf, glass pot.", img: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80" },
  ],
  Specials: [
    { name: "Chef's Seven-Course Tasting", price: 3800, veg: false, tags: ["Chef's Special"], desc: "A journey through the coast. Vegetarian on request.", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80" },
  ],
};
export type MenuItem = (typeof menu)["Starters"][number];

export const gallery = [
  { cat: "Rooms", src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80", h: "tall" },
  { cat: "Dining", src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80", h: "short" },
  { cat: "Exterior", src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80", h: "tall" },
  { cat: "Dining", src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80", h: "short" },
  { cat: "Events", src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80", h: "tall" },
  { cat: "Rooms", src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80", h: "short" },
  { cat: "Dining", src: "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=900&q=80", h: "tall" },
  { cat: "Exterior", src: "https://images.unsplash.com/photo-1587985064135-0366536eab42?auto=format&fit=crop&w=900&q=80", h: "short" },
  { cat: "Events", src: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=900&q=80", h: "tall" },
  { cat: "Rooms", src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80", h: "short" },
  { cat: "Dining", src: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=80", h: "tall" },
  { cat: "Exterior", src: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=900&q=80", h: "short" },
];

export const amenities = [
  { name: "Free WiFi", icon: "Wifi" },
  { name: "Infinity Pool", icon: "Waves" },
  { name: "Wellness Spa", icon: "Flower2" },
  { name: "Valet Parking", icon: "Car" },
  { name: "Fine Dining", icon: "UtensilsCrossed" },
  { name: "Fitness", icon: "Dumbbell" },
  { name: "24/7 Room Service", icon: "BellRing" },
  { name: "Airport Pickup", icon: "Plane" },
] as const;
