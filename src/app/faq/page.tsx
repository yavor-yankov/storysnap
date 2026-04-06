"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

const faqs = [
  {
    category: "Преглед и поръчка",
    items: [
      {
        q: "Безплатен ли е прегледът?",
        a: "Да, напълно безплатен. Генерираме 5 персонализирани страници с лицето на вашето дете без никакво плащане или регистрация. Получавате максимум 2 безплатни прегледа на имейл адрес.",
      },
      {
        q: "Трябва ли да се регистрирам?",
        a: "Не. За безплатния преглед е нужен само имейл адрес. За поръчка също — само имейл и данни за доставка. Нямаме задължителна регистрация.",
      },
      {
        q: "Колко отнема генерирането?",
        a: "Безплатният преглед (5 страници) е готов за около 2–3 минути. Пълната книжка (24 илюстрации) се генерира след плащане за около 10–15 минути.",
      },
      {
        q: "Мога ли да опитам с нова снимка, ако не съм доволен?",
        a: "Да. Ако резултатът не ви удовлетворява, можете да качите нова снимка и да генерирате нов безплатен преглед. Помнете, че имате 2 безплатни прегледа на имейл адрес.",
      },
    ],
  },
  {
    category: "Снимки и AI",
    items: [
      {
        q: "Каква снимка да кача?",
        a: "Фронтална снимка с ясно видимо лице, добро осветление и без тъмни очила. Минимален размер 400×400 px. Форматите JPG и PNG се поддържат. Избягвайте снимки с много хора или замъглено лице.",
      },
      {
        q: "Как AI поставя лицето на детето?",
        a: "Използваме flux-kontext-dev — специализиран AI модел, обучен върху детски портрети и илюстративни стилове. Той разпознава лицето от снимката и го интегрира естествено в илюстрациите на книжката.",
      },
      {
        q: "Колко добра е точността на лицето?",
        a: "Резултатите са много добри при ясна фронтална снимка с добро осветление. Моделът запазва основните черти на лицето, но илюстрацията запазва и художествения стил на книжката.",
      },
      {
        q: "Мога ли да кача 2 снимки?",
        a: "Да, можете да качите до 2 снимки. Препоръчваме 1 ясна фронтална снимка за най-добри резултати. Втората снимка може да помогне, ако първата е с по-нисък контраст.",
      },
    ],
  },
  {
    category: "Цени и плащане",
    items: [
      {
        q: "Какви са цените?",
        a: "Дигитален PDF: 9.90 лв — изтегляте веднага след плащане. Твърда корица (A4, 24 стр.): 34 лв — печатаме и доставяме до 3–5 работни дни.",
      },
      {
        q: "Как мога да платя?",
        a: "Приемаме Visa, Mastercard и Apple Pay. Плащането се обработва сигурно чрез Stripe — ние никога не виждаме данните на вашата карта.",
      },
      {
        q: "Мога ли да получа фактура?",
        a: "Да. Моля, свържете се с нас на hello@herobook.bg с номера на вашата поръчка и фирмените данни.",
      },
      {
        q: "Има ли политика за връщане?",
        a: "При дигитален PDF — не приемаме връщания след изтегляне. При твърда корица — ако книжката е наредена с грешка от наша страна, отпечатваме нова безплатно. Свържете се с нас в рамките на 7 дни след получаване.",
      },
    ],
  },
  {
    category: "Доставка",
    items: [
      {
        q: "До кои адреси доставяте?",
        a: "Доставяме до всички адреси в България. При запитване за международна доставка — пишете ни на hello@herobook.bg.",
      },
      {
        q: "Колко отнема доставката?",
        a: "Печатаме и изпращаме в рамките на 1–2 работни дни след потвърждение на поръчката. Куриерската доставка отнема 1–3 работни дни в зависимост от адреса.",
      },
      {
        q: "Как ще разбера, когато поръчката е изпратена?",
        a: "Ще получите имейл с номер за проследяване, когато книжката бъде предадена на куриера.",
      },
    ],
  },
  {
    category: "Поверителност и сигурност",
    items: [
      {
        q: "Какво правите с детските снимки?",
        a: "Снимките се използват само за генериране на вашата книжка. Не се споделят с трети страни и не се използват за обучение на AI модели. Съхраняват се максимум 30 дни, след което се изтриват автоматично.",
      },
      {
        q: "Безопасно ли е плащането?",
        a: "Да. Всички плащания се обработват чрез Stripe — световен лидер в онлайн плащанията. Данните на вашата карта никога не преминават през нашите сървъри.",
      },
      {
        q: "Спазвате ли GDPR?",
        a: "Да. Събираме само необходимите данни, съхраняваме ги сигурно и ги изтриваме когато целта е изпълнена. Можете да поискате изтриване на данните си по всяко време като пишете на hello@herobook.bg.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-brand-beige-dark rounded-2xl bg-white overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-brand-beige/50 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-bold text-brand-brown text-base">{q}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-brand-orange transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-brand-brown-body text-sm leading-relaxed border-t border-brand-beige-dark pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Hero */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-3">
            Помощен център
          </p>
          <h1 className="text-4xl font-black text-brand-brown sm:text-5xl leading-tight">
            Често задавани{" "}
            <span className="relative inline-block">
              въпроси
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 right-0 h-2 rounded-full bg-brand-gold/70"
              />
            </span>
          </h1>
          <p className="mt-6 text-lg text-brand-brown-body max-w-xl mx-auto leading-relaxed">
            Намерете бързи отговори на най-честите въпроси за HeroBook.
          </p>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xs font-black uppercase tracking-widest text-brand-orange mb-5">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still need help */}
      <section className="py-10 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white border border-brand-beige-dark p-8 text-center shadow-[0_4px_16px_rgba(17,24,39,0.06)]">
            <div className="text-3xl mb-4">💬</div>
            <h2 className="text-xl font-black text-brand-brown mb-2">
              Не намерихте отговор?
            </h2>
            <p className="text-brand-brown-body text-sm mb-6 max-w-sm mx-auto">
              Нашият екип отговаря в рамките на 24 часа. Пишете ни — с
              удоволствие ще помогнем.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-orange px-7 py-3 text-sm font-bold text-white hover:bg-brand-orange-hover transition-colors shadow-md"
            >
              Свържи се с нас
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
