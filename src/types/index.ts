// Story template types
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

// Order types
export type OrderStatus =
  | "paid"
  | "generating"
  | "complete"
  | "shipped"
  | "delivered"
  | "refunded";

export type ProductType = "digital" | "physical";

export interface Order {
  id: string;
  user_id: string;
  story_id: string;
  order_number: string;
  product_type: ProductType;
  status: OrderStatus;
  child_name: string;
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

// Preview tracking
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

// Filter types for story catalog
export interface StoryFilters {
  ageGroup: "all" | "0-2" | "2-4" | "4-6";
  gender: "all" | "boy" | "girl";
}
