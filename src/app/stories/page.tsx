import { StoryCatalog } from "@/components/landing/story-catalog";

export const metadata = {
  title: "Всички книжки — HeroBook",
  description: "Разгледай нашите персонализирани детски книжки. Над 8 истории за деца 0–8 години.",
};

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-brand-beige py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-2 text-sm font-semibold text-brand-brown-body">
          <span>Начало</span>
          <span className="mx-2 text-brand-brown/30">/</span>
          <span className="text-brand-brown">Книжки</span>
        </div>
        <h1 className="mb-8 text-3xl font-black text-brand-brown sm:text-4xl">
          Всички книжки
        </h1>
      </div>
      <StoryCatalog />
    </div>
  );
}
