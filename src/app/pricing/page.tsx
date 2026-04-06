import Link from "next/link";
import { Check, ChevronRight, Download, Package, Sparkles } from "lucide-react";

export const metadata = {
  title: "Цени — HeroBook",
  description:
    "Дигитален PDF за 9.90 лв или твърда корица за 34 лв. Персонализирана детска книжка с лицето на вашето дете. Безплатен преглед преди поръчка.",
};

const digitalFeatures = [
  "24 персонализирани илюстрации",
  "Висококачествен PDF за печат",
  "Изтегляне веднага след плащане",
  "Можете да печатате многократно",
  "Безплатен преглед преди поръчка",
  "Доставка по имейл",
];

const physicalFeatures = [
  "24 персонализирани илюстрации",
  "Твърда корица, A4 формат",
  "Висококачествен цветен печат",
  "Издръжливи, детски-безопасни материали",
  "Безплатен преглед преди поръчка",
  "Доставка до 3–5 работни дни",
  "Произведено в България",
];

const faq = [
  {
    q: "Мога ли да видя книжката преди да платя?",
    a: "Да! Безплатният преглед включва 5 персонализирани страници с лицето на вашето дете. Без регистрация, без плащане.",
  },
  {
    q: "Колко бързо получавам дигиталния PDF?",
    a: "Веднага след потвърждение на плащането — PDF се генерира и изпраща на имейла ви в рамките на минути.",
  },
  {
    q: "Мога ли да поръчам няколко копия на твърда корица?",
    a: "Да. За поръчки на повече от 3 копия свържете се с нас на hello@herobook.bg за групова цена.",
  },
  {
    q: "Има ли скрити такси?",
    a: "Не. Посочените цени са крайни с включен ДДС. При твърда корица доставката е включена в цената.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Hero */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-3">
            Прозрачни цени
          </p>
          <h1 className="text-4xl font-black text-brand-brown sm:text-5xl leading-tight">
            Изберете своя{" "}
            <span className="relative inline-block">
              формат
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 right-0 h-2 rounded-full bg-brand-gold/70"
              />
            </span>
          </h1>
          <p className="mt-6 text-lg text-brand-brown-body max-w-xl mx-auto leading-relaxed">
            Дигитален PDF или красива твърда корица — и двете включват 24
            уникални илюстрации с лицето на вашето дете.
          </p>
          <p className="mt-3 text-sm font-semibold text-brand-orange">
            Безплатен преглед преди всяка поръчка — без регистрация
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Digital */}
            <div className="rounded-3xl bg-white border-2 border-brand-beige-dark p-8 shadow-[0_4px_16px_rgba(17,24,39,0.07)]">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-teal/10 mb-6">
                <Download className="h-6 w-6 text-brand-teal" />
              </div>
              <h2 className="text-2xl font-black text-brand-brown mb-1">
                Дигитален PDF
              </h2>
              <p className="text-brand-brown-sub text-sm mb-6">
                Изтеглете веднага, печатайте многократно
              </p>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-black text-brand-brown">9.90</span>
                <span className="text-2xl font-bold text-brand-brown-sub mb-1">лв</span>
              </div>
              <ul className="space-y-3 mb-8">
                {digitalFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5 text-brand-teal" />
                    <span className="text-sm text-brand-brown-body">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/stories"
                className="flex items-center justify-center gap-2 w-full rounded-2xl border-2 border-brand-orange text-brand-orange font-bold py-3.5 hover:bg-brand-orange/5 transition-colors"
              >
                Избери история
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Physical — highlighted */}
            <div className="rounded-3xl bg-brand-orange p-8 shadow-[0_8px_32px_rgba(255,107,53,0.30)] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 bg-brand-brown text-white text-xs font-black uppercase tracking-wide px-4 py-1.5 rounded-full shadow-md">
                  <Sparkles className="h-3 w-3" />
                  Най-популярен
                </span>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 mb-6">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-1">
                Твърда корица
              </h2>
              <p className="text-white/75 text-sm mb-6">
                Красива книжка с доставка до вас
              </p>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-black text-white">34</span>
                <span className="text-2xl font-bold text-white/75 mb-1">лв</span>
              </div>
              <ul className="space-y-3 mb-8">
                {physicalFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5 text-white" />
                    <span className="text-sm text-white/90">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/stories"
                className="flex items-center justify-center gap-2 w-full rounded-2xl bg-white text-brand-orange font-bold py-3.5 hover:bg-brand-beige transition-colors shadow-md"
              >
                Избери история
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Free preview callout */}
          <div className="mt-8 rounded-2xl bg-white border border-brand-beige-dark p-6 text-center">
            <p className="text-brand-brown font-bold mb-1">
              Не сте сигурни? Пробвайте безплатно!
            </p>
            <p className="text-sm text-brand-brown-sub mb-4">
              Генерирайте 5 персонализирани страници с лицето на вашето дете
              напълно безплатно — без регистрация.
            </p>
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange hover:underline"
            >
              Започни безплатния преглед →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-3">
              Въпроси за цените
            </p>
            <h2 className="text-3xl font-black text-brand-brown sm:text-4xl">
              Отговори
            </h2>
          </div>
          <div className="space-y-5">
            {faq.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl bg-brand-beige border border-brand-beige-dark p-6"
              >
                <h3 className="font-bold text-brand-brown mb-2 text-base">
                  {item.q}
                </h3>
                <p className="text-sm text-brand-brown-body leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-brand-brown-sub">
            Имате друг въпрос?{" "}
            <Link href="/faq" className="text-brand-orange font-semibold hover:underline">
              Вижте всички ЧЗВ
            </Link>{" "}
            или{" "}
            <Link href="/contact" className="text-brand-orange font-semibold hover:underline">
              пишете ни
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-brand-beige py-10 border-t border-brand-beige-dark">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { icon: "🔒", text: "Сигурно плащане" },
              { icon: "🇧🇬", text: "Произведено в България" },
              { icon: "📦", text: "Доставка включена" },
              { icon: "✅", text: "Без скрити такси" },
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
    </div>
  );
}
