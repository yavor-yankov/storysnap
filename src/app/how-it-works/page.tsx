import Link from "next/link";
import {
  BookOpen,
  Camera,
  Eye,
  ShoppingCart,
  Cpu,
  ImageIcon,
  Clock,
  UserCheck,
  Image,
  ChevronRight,
  Sparkles,
  Shield,
} from "lucide-react";

export const metadata = {
  title: "Как работи — HeroBook",
  description:
    "Научи как HeroBook създава персонализирани детски книжки с лицето на твоето дете в 4 лесни стъпки. AI технология, безплатен преглед, доставка в България.",
};

const steps = [
  {
    number: "01",
    icon: BookOpen,
    title: "Избери история",
    color: "bg-brand-teal-light",
    iconColor: "text-brand-teal",
    borderColor: "border-brand-teal/30",
    numberColor: "text-brand-teal",
    description:
      "Разгледай нашите 8 вълшебни истории и избери тази, която ще грабне сърцето на твоето дете.",
    substeps: [
      "Разгледай каталога с 8 различни тематични истории",
      'Прочети кратко описание и подходяща възрастова група (1–8 г.)',
      "Виж примерни илюстрации от всяка история",
      "Кликни върху избраната история, за да продължиш",
    ],
    themes: [
      "Космически приключения",
      "Принцесата на гората",
      "Супергерой в града",
      "Подводното царство",
      "Вълшебната ферма",
      "Динозаврите се завръщат",
      "Пираткото съкровище",
      "Зимните магии",
    ],
  },
  {
    number: "02",
    icon: Camera,
    title: "Качи снимка на детето",
    color: "bg-brand-orange/8",
    iconColor: "text-brand-orange",
    borderColor: "border-brand-orange/30",
    numberColor: "text-brand-orange",
    description:
      "Качи 1–2 ясни снимки на детето. AI разпознава лицето и го подготвя за поставяне в илюстрациите.",
    substeps: [
      "Качи 1 или 2 снимки в JPG или PNG формат",
      "Снимките трябва да са с добро осветление и ясно видимо лице",
      "AI системата извлича характеристиките на лицето автоматично",
      "Снимките се обработват сигурно и се изтриват след 30 дни",
    ],
    tip: "Най-добри резултати се постигат с фронтална снимка при естествена светлина, без слънчеви очила.",
  },
  {
    number: "03",
    icon: Eye,
    title: "Виж персонализирания преглед",
    color: "bg-brand-purple-light",
    iconColor: "text-[#9b5fc0]",
    borderColor: "border-[#d999ff]/30",
    numberColor: "text-[#9b5fc0]",
    description:
      "Преди да поръчаш, получаваш безплатен преглед на 5 персонализирани страници. Виж как изглежда детето ти в книжката.",
    substeps: [
      "AI генерира 5 уникални илюстрации с лицето на детето",
      "Прегледът е напълно безплатен — без нужда от регистрация",
      "Разглеждаш страниците и решаваш дали да продължиш",
      "Ако не си доволен, можеш да качиш нова снимка и да опиташ отново",
    ],
  },
  {
    number: "04",
    icon: ShoppingCart,
    title: "Поръчай",
    color: "bg-brand-yellow-light",
    iconColor: "text-brand-brown",
    borderColor: "border-brand-gold/50",
    numberColor: "text-brand-brown",
    description:
      "Избери дигитален PDF или твърда корица. Плати сигурно онлайн и получи своята вълшебна книжка.",
    substeps: [
      "Избери формат: Дигитален PDF (9.90 лв) или Твърда корица (34 лв)",
      "Въведи данни за доставка (само при твърда корица)",
      "Плати с Visa, Mastercard или Apple Pay",
      "PDF се изтегля веднага; книжката пристига за 3–5 работни дни",
    ],
  },
];

const faqs = [
  {
    icon: Clock,
    question: "Колко отнема създаването?",
    answer:
      "Безплатният преглед от 5 страници е готов за около 2–3 минути след качване на снимката. Пълната книжка (24 илюстрации) се генерира за около 10–15 минути. При поръчка на твърда корица добавете 3–5 работни дни за печат и доставка.",
  },
  {
    icon: UserCheck,
    question: "Трябва ли профил?",
    answer:
      "Не е нужен профил, за да разгледаш историите или да видиш безплатния преглед. За да поръчаш, въвеждаш само имейл адрес — без регистрация, без пароли.",
  },
  {
    icon: Image,
    question: "Каква снимка да кача?",
    answer:
      "Фронтална снимка с ясно видимо лице, добро осветление и без тъмни очила. Минимален размер 400×400 px. Форматите JPG и PNG се поддържат. Избягвай снимки с много хора или замъглено лице — резултатите ще са много по-добри с една ясна снимка.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Hero */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-3">
            Четири лесни стъпки
          </p>
          <h1 className="text-4xl font-black text-brand-brown sm:text-5xl lg:text-6xl leading-tight">
            Как работи{" "}
            <span className="relative inline-block">
              HeroBook?
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 right-0 h-2 rounded-full bg-brand-gold/70"
              />
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-brand-brown-body max-w-2xl mx-auto">
            За под 5 минути вашето дете може да стане главният герой на своя
            собствена приказка. Без технически умения — просто снимка и малко
            AI магия.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/stories"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-orange px-7 py-3.5 text-base font-bold text-white shadow-md hover:bg-brand-orange-hover transition-colors"
            >
              Разгледай историите
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-beige-dark bg-brand-beige px-7 py-3.5 text-base font-bold text-brand-brown hover:bg-brand-beige-dark transition-colors"
            >
              Виж цените
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={`relative rounded-3xl border-2 ${step.borderColor} ${step.color} p-8 sm:p-10`}
                >
                  {/* Step header */}
                  <div className="flex items-start gap-5 mb-6">
                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm">
                      <Icon className={`h-7 w-7 ${step.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`text-xs font-black uppercase tracking-widest ${step.numberColor} mb-1`}>
                        Стъпка {step.number}
                      </div>
                      <h2 className="text-2xl font-black text-brand-brown">
                        {step.title}
                      </h2>
                      <p className="mt-1.5 text-brand-brown-body leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className="hidden sm:block text-7xl font-black text-brand-brown/5 leading-none flex-shrink-0"
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Sub-steps */}
                  <ul className="grid sm:grid-cols-2 gap-3 mb-4">
                    {step.substeps.map((sub, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm text-xs font-black text-brand-brown">
                          {i + 1}
                        </span>
                        <span className="text-sm text-brand-brown-body leading-relaxed">
                          {sub}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Themes grid (step 1 only) */}
                  {step.themes && (
                    <div className="mt-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-brand-brown-sub mb-3">
                        8 теми за избор:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {step.themes.map((theme) => (
                          <span
                            key={theme}
                            className="inline-block rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-brand-brown shadow-sm"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tip (step 2 only) */}
                  {step.tip && (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3">
                      <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5 text-brand-orange" />
                      <p className="text-sm text-brand-brown-body">
                        <strong className="text-brand-brown font-bold">Съвет:</strong>{" "}
                        {step.tip}
                      </p>
                    </div>
                  )}

                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <div
                      aria-hidden
                      className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border border-brand-beige-dark z-10"
                    >
                      <ChevronRight className="h-5 w-5 rotate-90 text-brand-orange" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Tech Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-teal mb-3">
              Технология
            </p>
            <h2 className="text-3xl font-black text-brand-brown sm:text-4xl">
              Как AI поставя лицето?
            </h2>
            <p className="mt-4 text-brand-brown-body max-w-2xl mx-auto leading-relaxed">
              Използваме специализиран AI модел, обучен специално за детски
              портрети, за да гарантираме естествени и красиви резултати.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-brand-beige p-7">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-teal/10 mb-4">
                <Cpu className="h-6 w-6 text-brand-teal" />
              </div>
              <h3 className="text-lg font-extrabold text-brand-brown mb-2">
                flux-kontext-dev модел
              </h3>
              <p className="text-sm text-brand-brown-body leading-relaxed">
                Моделът flux-kontext-dev е обучен специално върху детски
                портрети и илюстративни стилове. Той разбира контекста на
                историята и позиционира лицето по естествен начин.
              </p>
            </div>

            <div className="rounded-2xl bg-brand-beige p-7">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-orange/10 mb-4">
                <ImageIcon className="h-6 w-6 text-brand-orange" />
              </div>
              <h3 className="text-lg font-extrabold text-brand-brown mb-2">
                24 уникални илюстрации
              </h3>
              <p className="text-sm text-brand-brown-body leading-relaxed">
                Всяка книжка съдържа 24 страниц с уникални илюстрации. Лицето
                на детето се адаптира към различни ъгли, осветления и сцени, за
                да изглежда естествено на всяка страница.
              </p>
            </div>

            <div className="rounded-2xl bg-brand-beige p-7">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-purple-light mb-4">
                <Shield className="h-6 w-6 text-[#9b5fc0]" />
              </div>
              <h3 className="text-lg font-extrabold text-brand-brown mb-2">
                Поверителност на първо място
              </h3>
              <p className="text-sm text-brand-brown-body leading-relaxed">
                Снимките се обработват само за генериране на книжката. Не се
                споделят с трети страни. Съхраняват се максимум 30 дни, след
                което се изтриват автоматично.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-3">
              Бързи отговори
            </p>
            <h2 className="text-3xl font-black text-brand-brown sm:text-4xl">
              Често задавани въпроси
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {faqs.map((faq) => {
              const Icon = faq.icon;
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl bg-white p-6 shadow-[0_4px_16px_rgba(17,24,39,0.07)]"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-beige mb-4">
                    <Icon className="h-5 w-5 text-brand-orange" />
                  </div>
                  <h3 className="font-extrabold text-brand-brown mb-2 text-base">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-brand-brown-body leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              );
            })}
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
            Безплатният преглед не изисква регистрация или плащане. Вижте
            как изглежда детето ви в книжката преди да поръчате.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/stories"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-brand-orange shadow-lg hover:bg-brand-beige transition-colors"
            >
              Избери история
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-white/70">
            Безплатен преглед · Без регистрация · Made in Bulgaria
          </p>
        </div>
      </section>
    </div>
  );
}
