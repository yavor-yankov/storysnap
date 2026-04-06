import Link from "next/link";
import { ChevronRight, Heart, Sparkles, Shield, BookOpen, Users, MapPin } from "lucide-react";

export const metadata = {
  title: "За нас — HeroBook",
  description:
    "HeroBook е създадена от родители за родители. Научи повече за нашата мисия да правим магически персонализирани детски книжки в България.",
};

const values = [
  {
    icon: Heart,
    title: "Създадено с любов",
    color: "bg-brand-orange/10",
    iconColor: "text-brand-orange",
    description:
      "Всяка книжка е уникална творба. Вярваме, че магията започва когато детето види себе си като герой.",
  },
  {
    icon: Shield,
    title: "Поверителност на първо място",
    color: "bg-brand-teal-light",
    iconColor: "text-brand-teal",
    description:
      "Снимките на вашите деца са свещени. Обработваме ги само за генериране на книжката и ги изтриваме след 30 дни.",
  },
  {
    icon: MapPin,
    title: "Произведено в България",
    color: "bg-brand-yellow-light",
    iconColor: "text-brand-brown",
    description:
      "Печатаме локално в България с висококачествени материали. Подкрепяме местния бизнес и намаляваме въглеродния отпечатък.",
  },
  {
    icon: Sparkles,
    title: "AI с душа",
    color: "bg-brand-purple-light",
    iconColor: "text-[#9b5fc0]",
    description:
      "Използваме най-съвременния AI не за да замени творчеството, а за да го персонализира — за всяко дете поотделно.",
  },
];

const stats = [
  { value: "8", label: "уникални истории" },
  { value: "24", label: "илюстрации на книжка" },
  { value: "30 дни", label: "съхранение на снимки" },
  { value: "100%", label: "произведено в България" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Hero */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-3">
            Нашата история
          </p>
          <h1 className="text-4xl font-black text-brand-brown sm:text-5xl lg:text-6xl leading-tight">
            За{" "}
            <span className="relative inline-block">
              HeroBook
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 right-0 h-2 rounded-full bg-brand-gold/70"
              />
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-brand-brown-body max-w-2xl mx-auto">
            Започнахме с прост въпрос: &ldquo;Какво би означавало за едно дете да
            види себе си като героя на своята любима приказка?&rdquo; Отговорът
            стана HeroBook.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-3">
                Нашата мисия
              </p>
              <h2 className="text-3xl font-black text-brand-brown sm:text-4xl mb-5">
                Всяко дете заслужава своя приказка
              </h2>
              <div className="space-y-4 text-brand-brown-body leading-relaxed">
                <p>
                  Книгите формират детската фантазия. Но колко по-силно е
                  въздействието, когато главният герой изглежда точно като
                  вашето дете?
                </p>
                <p>
                  HeroBook съчетава изкуствения интелект с топлото майсторство
                  на детската илюстрация, за да създаде книжки, в които всяко
                  дете е уникален и незаменим герой.
                </p>
                <p>
                  Вярваме, че четенето трябва да бъде лично, вълшебно и
                  достъпно за всяко семейство в България.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white p-6 text-center shadow-[0_4px_16px_rgba(17,24,39,0.07)]"
                >
                  <div className="text-3xl font-black text-brand-orange mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-brand-brown-sub font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-teal mb-3">
              Нашите ценности
            </p>
            <h2 className="text-3xl font-black text-brand-brown sm:text-4xl">
              Какво ни движи
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-2xl border border-brand-beige-dark bg-brand-beige p-7"
                >
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-2xl ${v.color} mb-4`}
                  >
                    <Icon className={`h-6 w-6 ${v.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-extrabold text-brand-brown mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-brand-brown-body leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-3">
              Зад кулисите
            </p>
            <h2 className="text-3xl font-black text-brand-brown sm:text-4xl">
              Малък екип, голяма мечта
            </h2>
            <p className="mt-4 text-brand-brown-body max-w-2xl mx-auto leading-relaxed">
              HeroBook е създадена от малък екип от родители, дизайнери и
              разработчици в София. Обединява ни вярата, че технологията може
              да прави детството по-вълшебно.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white p-7 text-center shadow-[0_4px_16px_rgba(17,24,39,0.07)]">
              <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center mx-auto mb-4 text-3xl">
                👨‍💻
              </div>
              <h3 className="font-extrabold text-brand-brown mb-1">
                Технология
              </h3>
              <p className="text-sm text-brand-brown-sub">
                AI и разработка
              </p>
            </div>
            <div className="rounded-2xl bg-white p-7 text-center shadow-[0_4px_16px_rgba(17,24,39,0.07)]">
              <div className="w-16 h-16 rounded-full bg-brand-teal/10 flex items-center justify-center mx-auto mb-4 text-3xl">
                🎨
              </div>
              <h3 className="font-extrabold text-brand-brown mb-1">
                Дизайн
              </h3>
              <p className="text-sm text-brand-brown-sub">
                Илюстрации и UX
              </p>
            </div>
            <div className="rounded-2xl bg-white p-7 text-center shadow-[0_4px_16px_rgba(17,24,39,0.07)]">
              <div className="w-16 h-16 rounded-full bg-brand-yellow-light flex items-center justify-center mx-auto mb-4 text-3xl">
                ❤️
              </div>
              <h3 className="font-extrabold text-brand-brown mb-1">
                Родители
              </h3>
              <p className="text-sm text-brand-brown-sub">
                Вдъхновение и тест
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-white py-12 sm:py-14 border-t border-brand-beige-dark">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { icon: "🇧🇬", text: "Произведено в България" },
              { icon: "🔒", text: "Сигурно плащане" },
              { icon: "📦", text: "Бърза доставка" },
              { icon: "💬", text: "Поддръжка на български" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-semibold text-brand-brown-sub">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-orange py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Готови ли сте да създадете магия?
          </h2>
          <p className="mt-4 text-white/85 text-lg leading-relaxed">
            Безплатният преглед не изисква регистрация. Вижте как изглежда
            детето ви в книжката за по-малко от 3 минути.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/stories"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-brand-orange shadow-lg hover:bg-brand-beige transition-colors"
            >
              Разгледай историите
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/40 px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition-colors"
            >
              Свържи се с нас
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
