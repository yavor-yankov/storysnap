// ============================================================
// Child personalisation attributes
// ============================================================
export type HairColor = "black" | "brown" | "blonde" | "red" | "grey" | "other";
export type HairStyle = "short" | "long" | "curly" | "straight" | "wavy" | "braided" | "ponytail" | "buzz";
export type EyeColor = "brown" | "blue" | "green" | "hazel" | "grey";
export type SkinTone = "very-light" | "light" | "medium" | "tan" | "deep" | "dark";

export interface ChildAttributes {
  /** Visual — used in every Flux image prompt */
  hairColor?: HairColor;
  hairStyle?: HairStyle;
  eyeColor?: EyeColor;
  skinTone?: SkinTone;
  /** Hex or CSS colour name — featured in the child's clothing/accessories */
  favoriteColor?: string;
  /** Narrative — free text, up to 120 chars each */
  interests?: string;
  personalityTraits?: string;
  /** Printed on the PDF dedication page */
  dedication?: string;
}

// ============================================================
// Story template types
// ============================================================

/** Seed beat used to anchor a page's story/image direction */
export interface SeedPrompt {
  page: number;
  /** Brief description of what happens on this page */
  beat: string;
  /** Visual concept for the Flux image (no character description — that's injected separately) */
  image_concept: string;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  description: string;
  age_min: number;
  age_max: number;
  gender: "boy" | "girl" | "unisex";
  page_count: number;
  cover_image_url: string;
  preview_images: string[];
  is_active: boolean;
  is_new: boolean;
  sort_order: number;
  created_at: string;
  // ── v2 template enrichment ───────────────────────────────
  /** Full-bleed hero image for catalog cards */
  hero_image_url?: string | null;
  /** Smaller variant for dropdowns / search */
  card_image_url?: string | null;
  /** One-liner tagline shown under the title */
  summary_short?: string | null;
  /** Filter tags e.g. ["Adventure", "Animals"] */
  tags?: string[];
  /** Bulgarian teaser shown on the catalog page */
  sample_first_page?: string | null;
  /** Page-by-page beats passed to Claude/Groq */
  seed_prompts?: SeedPrompt[] | null;
  /** Tone/style guidance for the story generator */
  style_notes?: string | null;
  /** Pool of random "twists" — one picked per order so stories vary */
  variation_twists?: string[];
}

export interface StoryPage {
  id: string;
  story_id: string;
  page_number: number;
  illustration_url: string;
  text_content: string;
  face_region: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

// ============================================================
// Order types
// ============================================================
export type OrderStatus =
  | "paid"
  | "generating"
  | "complete"
  | "shipped"
  | "delivered"
  | "refunded"
  | "failed";

export type ProductType = "digital" | "physical";

export interface Order {
  id: string;
  user_id: string;
  story_id: string;
  order_number: string;
  product_type: ProductType;
  status: OrderStatus;
  child_name: string;
  child_age?: number | null;
  child_gender?: "boy" | "girl" | "unisex" | null;
  child_attributes?: ChildAttributes | null;
  photo_urls: string[];
  amount_cents: number;
  currency: string;
  stripe_payment_id: string | null;
  stripe_session_id: string | null;
  pdf_url: string | null;
  shipping_address: ShippingAddress | null;
  tracking_number: string | null;
  customer_email: string;
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  postal_code: string;
  phone: string;
}

// ============================================================
// Preview tracking
// ============================================================
export interface PreviewRequest {
  id: string;
  user_id: string | null;
  email: string;
  story_id: string;
  ip_address: string;
  device_fingerprint: string | null;
  photo_urls: string[];
  status: "pending" | "generating" | "complete" | "failed";
  preview_pages: GeneratedPage[] | null;
  error_message?: string | null;
  // ── v2 personalisation ───────────────────────────────────
  child_name?: string | null;
  child_age?: number | null;
  child_gender?: "boy" | "girl" | "unisex" | null;
  child_attributes?: ChildAttributes | null;
  created_at: string;
}

export interface GeneratedPage {
  page_number: number;
  image_url: string;
  text_content: string;
}

// User profile
export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  role: "customer" | "admin";
  free_previews_used: number;
  newsletter_subscribed: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Filter types for story catalog
// ============================================================
export interface StoryFilters {
  ageGroup: "all" | "0-2" | "2-4" | "4-6" | "6-8";
  gender: "all" | "boy" | "girl";
  tag: string | null; // matches any entry in story.tags
}
