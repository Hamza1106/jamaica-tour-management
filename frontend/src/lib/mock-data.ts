import dunns from "@/assets/tour-dunns-river.jpg";
import blueMountains from "@/assets/tour-blue-mountains.jpg";
import ysFalls from "@/assets/tour-ys-falls.jpg";
import negril from "@/assets/tour-negril.jpg";
import airport from "@/assets/tour-airport.jpg";
import ricksCafe from "@/assets/tour-ricks-cafe.jpg";

export type Tour = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  priceUsd: number;
  durationHours: number;
  location: string;
  available: boolean;
  highlights: string[];
  itinerary: { time: string; stop: string }[];
  rating: number;
  reviewCount: number;
};

export const TOURS: Tour[] = [
  {
    slug: "dunns-river-falls",
    name: "Dunn's River Falls Adventure",
    tagline: "Climb Jamaica's most famous waterfall",
    description:
      "Climb the world-famous 600-foot terraced cascade hand-in-hand with our certified guides, swim in turquoise pools, and feel the rush of pure Caribbean nature.",
    image: dunns,
    priceUsd: 89,
    durationHours: 6,
    location: "Ocho Rios",
    available: true,
    highlights: ["Certified climbing guide", "Beach lounging time", "Hotel pickup included", "Lunch & drinks"],
    itinerary: [
      { time: "08:30", stop: "Hotel pickup" },
      { time: "10:00", stop: "Arrive at Dunn's River Falls" },
      { time: "11:00", stop: "Guided climb up the falls" },
      { time: "13:00", stop: "Beach time & lunch" },
      { time: "15:00", stop: "Return drive" },
    ],
    rating: 4.9,
    reviewCount: 1284,
  },
  {
    slug: "blue-mountains-coffee",
    name: "Blue Mountains Coffee Tour",
    tagline: "Sunrise above the clouds",
    description:
      "Wind up Jamaica's misty Blue Mountains, walk a working coffee estate, and sip the world's finest Blue Mountain brew straight from the source.",
    image: blueMountains,
    priceUsd: 119,
    durationHours: 8,
    location: "Blue Mountains",
    available: true,
    highlights: ["Working coffee estate visit", "Tasting flight", "Panoramic peak overlook", "Light Jamaican breakfast"],
    itinerary: [
      { time: "05:30", stop: "Pre-dawn hotel pickup" },
      { time: "07:00", stop: "Sunrise at the lookout" },
      { time: "09:00", stop: "Estate tour & tasting" },
      { time: "12:00", stop: "Mountain village lunch" },
      { time: "14:30", stop: "Return drive" },
    ],
    rating: 4.8,
    reviewCount: 642,
  },
  {
    slug: "ys-falls-zipline",
    name: "YS Falls & Zipline",
    tagline: "Seven cascades, one rope swing",
    description:
      "A lush hidden gem in St. Elizabeth — seven natural waterfalls, jungle ziplines, rope swings and turquoise swimming holes that you'll never want to leave.",
    image: ysFalls,
    priceUsd: 99,
    durationHours: 7,
    location: "St. Elizabeth",
    available: true,
    highlights: ["Zipline canopy ride", "Rope swing into pool", "Tubing on the river", "Picnic lunch"],
    itinerary: [
      { time: "08:00", stop: "Hotel pickup" },
      { time: "10:30", stop: "Arrive at YS Falls" },
      { time: "11:00", stop: "Zipline & swimming" },
      { time: "13:30", stop: "Lunch on the grounds" },
      { time: "16:00", stop: "Return drive" },
    ],
    rating: 4.9,
    reviewCount: 871,
  },
  {
    slug: "negril-seven-mile",
    name: "Negril Seven Mile Beach Day",
    tagline: "Sun, sand, and sunset",
    description:
      "Spend a slow Caribbean day on the legendary seven-mile stretch of soft white sand — reserved beach loungers, jerk lunch, and a sunset you'll never forget.",
    image: negril,
    priceUsd: 79,
    durationHours: 9,
    location: "Negril",
    available: true,
    highlights: ["Private beach loungers", "Authentic jerk lunch", "Sunset photo stop", "Round-trip transfer"],
    itinerary: [
      { time: "09:00", stop: "Hotel pickup" },
      { time: "11:00", stop: "Arrive Seven Mile Beach" },
      { time: "13:00", stop: "Jerk lunch on the sand" },
      { time: "17:30", stop: "Sunset photos" },
      { time: "19:30", stop: "Return drive" },
    ],
    rating: 4.7,
    reviewCount: 533,
  },
  {
    slug: "ricks-cafe-sunset",
    name: "Rick's Cafe Sunset & Cliff Diving",
    tagline: "Jamaica's most famous sunset",
    description:
      "Watch cliff divers leap into the Caribbean while reggae plays and the sun melts into the sea. The most iconic sunset on the island.",
    image: ricksCafe,
    priceUsd: 69,
    durationHours: 5,
    location: "Negril",
    available: true,
    highlights: ["Front-row sunset seats", "Live reggae band", "Cliff diving show", "Cocktail included"],
    itinerary: [
      { time: "15:00", stop: "Hotel pickup" },
      { time: "16:30", stop: "Arrive at Rick's Cafe" },
      { time: "18:30", stop: "Sunset & cliff divers" },
      { time: "20:00", stop: "Return drive" },
    ],
    rating: 4.8,
    reviewCount: 712,
  },
  {
    slug: "private-island-tour",
    name: "Private Island Highlights",
    tagline: "Your day, your way",
    description:
      "A fully customized private tour with your own driver-guide and vehicle for the day. Build the itinerary that's perfect for your group.",
    image: airport,
    priceUsd: 249,
    durationHours: 10,
    location: "Islandwide",
    available: true,
    highlights: ["Private vehicle & driver", "Flexible itinerary", "Hotel & resort pickup", "Up to 6 guests"],
    itinerary: [
      { time: "Flexible", stop: "Build your own route with our concierge" },
    ],
    rating: 5.0,
    reviewCount: 198,
  },
];

export type Vehicle = {
  id: string;
  name: string;
  type: "Sedan" | "SUV" | "Van" | "Luxury";
  seats: number;
  luggage: number;
  pricePerKm: number;
  features: string[];
};

export const VEHICLES: Vehicle[] = [
  { id: "sedan-1", name: "Toyota Camry", type: "Sedan", seats: 3, luggage: 2, pricePerKm: 1.2, features: ["AC", "WiFi", "Bottled water"] },
  { id: "suv-1", name: "Toyota Land Cruiser", type: "SUV", seats: 5, luggage: 4, pricePerKm: 1.8, features: ["AC", "WiFi", "Premium seats"] },
  { id: "van-1", name: "Toyota Hiace", type: "Van", seats: 12, luggage: 12, pricePerKm: 2.4, features: ["AC", "Group friendly", "Large cargo"] },
  { id: "lux-1", name: "Mercedes-Benz GLS", type: "Luxury", seats: 4, luggage: 4, pricePerKm: 3.2, features: ["Leather", "Champagne", "Chauffeur"] },
];

export type Driver = {
  id: string;
  name: string;
  phone: string;
  rating: number;
  trips: number;
  status: "Available" | "On Trip" | "Off Duty";
  vehicle: string;
  joined: string;
};

export const DRIVERS: Driver[] = [
  { id: "DRV-001", name: "Marcus Brown", phone: "+1 876 555 0142", rating: 4.9, trips: 1284, status: "Available", vehicle: "SUV - Land Cruiser", joined: "2021-03-14" },
  { id: "DRV-002", name: "Tasha Williams", phone: "+1 876 555 0188", rating: 4.95, trips: 942, status: "On Trip", vehicle: "Sedan - Camry", joined: "2022-01-09" },
  { id: "DRV-003", name: "Andre Campbell", phone: "+1 876 555 0123", rating: 4.85, trips: 1502, status: "Available", vehicle: "Luxury - Mercedes GLS", joined: "2020-07-22" },
  { id: "DRV-004", name: "Janelle Grant", phone: "+1 876 555 0167", rating: 4.92, trips: 678, status: "Available", vehicle: "Van - Hiace", joined: "2022-11-02" },
  { id: "DRV-005", name: "Devon Powell", phone: "+1 876 555 0199", rating: 4.7, trips: 412, status: "Off Duty", vehicle: "Sedan - Camry", joined: "2023-05-18" },
];

export type Reservation = {
  id: string;
  customer: string;
  email: string;
  type: "Airport Transfer" | "Tour" | "Custom";
  detail: string;
  date: string;
  time: string;
  passengers: number;
  vehicle: string;
  driverId: string | null;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  totalUsd: number;
};

export const RESERVATIONS: Reservation[] = [
  { id: "RES-10241", customer: "Emma Carter", email: "emma@example.com", type: "Airport Transfer", detail: "MBJ → Sandals Royal Caribbean", date: "2026-06-22", time: "14:30", passengers: 2, vehicle: "Luxury - Mercedes GLS", driverId: "DRV-003", status: "Confirmed", totalUsd: 145 },
  { id: "RES-10242", customer: "James Patel", email: "james@example.com", type: "Tour", detail: "Dunn's River Falls Adventure", date: "2026-06-23", time: "08:30", passengers: 4, vehicle: "SUV - Land Cruiser", driverId: "DRV-001", status: "Confirmed", totalUsd: 356 },
  { id: "RES-10243", customer: "Sofia Reyes", email: "sofia@example.com", type: "Tour", detail: "Blue Mountains Coffee Tour", date: "2026-06-24", time: "05:30", passengers: 2, vehicle: "Sedan - Camry", driverId: "DRV-002", status: "Pending", totalUsd: 238 },
  { id: "RES-10244", customer: "Liam O'Connor", email: "liam@example.com", type: "Airport Transfer", detail: "KIN → Half Moon Resort", date: "2026-06-21", time: "11:00", passengers: 3, vehicle: "SUV - Land Cruiser", driverId: null, status: "Pending", totalUsd: 220 },
  { id: "RES-10245", customer: "Aisha Khan", email: "aisha@example.com", type: "Tour", detail: "Rick's Cafe Sunset", date: "2026-06-20", time: "15:00", passengers: 6, vehicle: "Van - Hiace", driverId: "DRV-004", status: "Completed", totalUsd: 414 },
  { id: "RES-10246", customer: "Noah Bennett", email: "noah@example.com", type: "Custom", detail: "Negril → Treasure Beach private day", date: "2026-06-19", time: "09:00", passengers: 4, vehicle: "Luxury - Mercedes GLS", driverId: "DRV-003", status: "Completed", totalUsd: 510 },
  { id: "RES-10247", customer: "Maya Lewis", email: "maya@example.com", type: "Tour", detail: "YS Falls & Zipline", date: "2026-06-25", time: "08:00", passengers: 2, vehicle: "Sedan - Camry", driverId: null, status: "Pending", totalUsd: 198 },
  { id: "RES-10248", customer: "Daniel Kim", email: "daniel@example.com", type: "Airport Transfer", detail: "MBJ → Negril", date: "2026-06-18", time: "19:45", passengers: 2, vehicle: "Sedan - Camry", driverId: "DRV-005", status: "Cancelled", totalUsd: 95 },
];

export type Testimonial = {
  name: string;
  location: string;
  rating: number;
  text: string;
  tour: string;
};

export const TESTIMONIALS: Testimonial[] = [
  { name: "Rachel & Tom", location: "Toronto, CA", rating: 5, tour: "Dunn's River Falls", text: "Marcus was incredible — punctual, funny, and made us feel like family. The falls were the highlight of our honeymoon." },
  { name: "The Henderson Family", location: "London, UK", rating: 5, tour: "Blue Mountains", text: "Watching the sun rise over the Blue Mountains while sipping the freshest coffee on earth — pure magic. Worth every penny." },
  { name: "Priya S.", location: "Mumbai, IN", rating: 5, tour: "Airport Transfer", text: "Booked the airport transfer at 2am and was greeted at the curb with a cold towel and bottled water. Five-star service." },
  { name: "Marcus J.", location: "Atlanta, US", rating: 5, tour: "Private Island Tour", text: "Andre built us a perfect day — beaches, jerk huts, waterfalls. He knew every shortcut and treated us like locals." },
];

// Analytics helpers
export const ANALYTICS = {
  totalBookings: 1284,
  monthRevenueUsd: 84500,
  avgRating: 4.89,
  activeDrivers: 18,
  bookingsTrend: [
    { day: "Mon", value: 42 }, { day: "Tue", value: 58 }, { day: "Wed", value: 49 },
    { day: "Thu", value: 71 }, { day: "Fri", value: 88 }, { day: "Sat", value: 96 }, { day: "Sun", value: 67 },
  ],
  popularTours: [
    { name: "Dunn's River", bookings: 412 },
    { name: "Blue Mountains", bookings: 287 },
    { name: "Negril Beach", bookings: 244 },
    { name: "YS Falls", bookings: 198 },
    { name: "Rick's Cafe", bookings: 143 },
  ],
};

export function getTour(slug: string) {
  return TOURS.find((t) => t.slug === slug);
}
