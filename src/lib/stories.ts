// Story data helpers — wraps Supabase queries with a static fallback for dev

import type { Story } from "@/types";

// Static seed data matching supabase/schema.sql (used when Supabase is not configured)
export const STORIES_SEED: Story[] = [
  {
    id: "1",
    title: "Космическото приключение",
    slug: "kosmichesko-priklyuchenie",
    description:
      "Твоето дете лети до звездите и открива нова планета! Вълнуващо космическо приключение за смели малчугани, които обичат да изследват непознатото.",
    age_min: 3,
    age_max: 7,
    gender: "unisex",
    page_count: 24,
    cover_image_url: "/images/placeholder-cover.jpg",
    preview_images: [],
    is_active: true,
    is_new: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Принцесата от Изгрева",
    slug: "printsesata-ot-izgreva",
    description:
      "Малката принцеса спасява вълшебното кралство с доброта и смелост. Приказка за момичета с голямо сърце, която учи на приятелство и куражиятство.",
    age_min: 2,
    age_max: 6,
    gender: "girl",
    page_count: 24,
    cover_image_url: "/images/placeholder-cover.jpg",
    preview_images: [],
    is_active: true,
    is_new: false,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Суперхеройски ден",
    slug: "supergerojski-den",
    description:
      "Днес твоето дете е супергерой! Спасява града, помага на приятели и научава, че добротата е истинска суперсила.",
    age_min: 3,
    age_max: 8,
    gender: "boy",
    page_count: 24,
    cover_image_url: "/images/placeholder-cover.jpg",
    preview_images: [],
    is_active: true,
    is_new: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "В джунглата на приятелите",
    slug: "v-dzhunglata-na-priyatelite",
    description:
      "Магическо пътуване в джунглата, където животните стават най-добри приятели с твоето дете.",
    age_min: 0,
    age_max: 4,
    gender: "unisex",
    page_count: 20,
    cover_image_url: "/images/placeholder-cover.jpg",
    preview_images: [],
    is_active: true,
    is_new: false,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Малкият готвач",
    slug: "malkiyat-gotvach",
    description:
      "В магическата кухня твоето дете готви вкусотии за цялото село! Забавна история за деца, които обичат да помагат.",
    age_min: 2,
    age_max: 5,
    gender: "unisex",
    page_count: 20,
    cover_image_url: "/images/placeholder-cover.jpg",
    preview_images: [],
    is_active: true,
    is_new: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Пиратите на Черно море",
    slug: "piratite-na-cherno-more",
    description:
      "Авантюра по морето с приятелски пирати. Твоето дете открива съкровищата на Черно море!",
    age_min: 4,
    age_max: 8,
    gender: "boy",
    page_count: 24,
    cover_image_url: "/images/placeholder-cover.jpg",
    preview_images: [],
    is_active: true,
    is_new: false,
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Феята на горите",
    slug: "feyata-na-gorite",
    description:
      "Вълшебна приказка за малката фея, която пази горите и животинките в тях.",
    age_min: 2,
    age_max: 5,
    gender: "girl",
    page_count: 20,
    cover_image_url: "/images/placeholder-cover.jpg",
    preview_images: [],
    is_active: true,
    is_new: false,
    sort_order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Динозавърът приятел",
    slug: "dinozavarat-priyatel",
    description:
      "Какво ще стане, ако твоето дете намери динозавърче? Приятелство без граници в праисторически свят!",
    age_min: 1,
    age_max: 5,
    gender: "unisex",
    page_count: 20,
    cover_image_url: "/images/placeholder-cover.jpg",
    preview_images: [],
    is_active: true,
    is_new: true,
    sort_order: 8,
    created_at: new Date().toISOString(),
  },
];

export function getStoryBySlug(slug: string): Story | undefined {
  return STORIES_SEED.find((s) => s.slug === slug);
}

// Cover gradient mapping for placeholder visuals
export const STORY_GRADIENTS: Record<string, string> = {
  "kosmichesko-priklyuchenie": "from-indigo-400 to-purple-500",
  "printsesata-ot-izgreva": "from-pink-400 to-rose-500",
  "supergerojski-den": "from-blue-500 to-cyan-400",
  "v-dzhunglata-na-priyatelite": "from-green-400 to-emerald-500",
  "malkiyat-gotvach": "from-orange-400 to-amber-500",
  "piratite-na-cherno-more": "from-slate-600 to-teal-500",
  "feyata-na-gorite": "from-purple-300 to-pink-400",
  "dinozavarat-priyatel": "from-lime-400 to-green-500",
};
