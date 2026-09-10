export type Role = "admin" | "team";

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  created_at: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  category: string;
  image_path: string | null;
  stock: number;
  featured: number;
  active: number;
  created_at: string;
}

export interface GalleryImage {
  id: number;
  path: string;
  caption: string;
  uploaded_by: number | null;
  uploader_name?: string | null;
  created_at: string;
}

export const CUSTOM_TYPES = [
  {
    value: "epoxy",
    label: "Epoxy",
    blurb: "Hand-poured resin coasters, trays, keychains and art pieces.",
  },
  {
    value: "rug",
    label: "Rug",
    blurb: "Tufted rugs and wall hangings made to your design.",
  },
] as const;
export type CustomType = (typeof CUSTOM_TYPES)[number]["value"];

export const CUSTOM_SIZES = [
  { value: "small", label: "Small", epoxy: 'Up to 4" (coasters, charms)', rug: 'Up to 18" (mini mats, wall art)' },
  { value: "medium", label: "Medium", epoxy: '4" – 10" (trays, clocks)', rug: '18" – 36" (accent rugs)' },
  { value: "large", label: "Large", epoxy: '10"+ (tables, wall pieces)', rug: '36"+ (statement rugs)' },
] as const;
export type CustomSize = (typeof CUSTOM_SIZES)[number]["value"];

export const REQUEST_STATUSES = [
  "new",
  "reviewing",
  "quoted",
  "in_progress",
  "completed",
  "declined",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export interface CustomRequest {
  id: number;
  name: string;
  email: string;
  product_type: CustomType;
  size: CustomSize;
  notes: string;
  images: string[];
  status: RequestStatus;
  created_at: string;
}

export interface OrderItem {
  product_id: number;
  name: string;
  price_cents: number;
  quantity: number;
  image_path: string | null;
}

export const ORDER_STATUSES = ["pending", "paid", "shipped", "completed", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface Order {
  id: number;
  customer_name: string;
  email: string;
  address: string;
  notes: string;
  items: OrderItem[];
  total_cents: number;
  status: OrderStatus;
  created_at: string;
}

export const PRODUCT_CATEGORIES = [
  "Plush",
  "Apparel",
  "Pins & Keychains",
  "Cards",
  "Epoxy",
  "Rugs",
  "Home",
  "Other",
] as const;
