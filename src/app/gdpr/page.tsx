import Link from "next/link";

const rights = [
  {
    emoji: "👁️",
    title: "Право на достъп",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    emojiColor: "bg-blue-100",
    description:
      "Имате право да получите потвърждение дали обработваме ваши лични данни и ако да — копие от тях заедно с информация за целите, категориите данни, получателите и срока на съхранение.",
    howTo:
      'Изпратете имейл на privacy@herobook.bg с тема \u201EИскане за достъп\u201C. Ще отговорим с копие на данните в срок до 30 дни.',
  },
  {
    emoji: "✏️",
    title: "Право на коригиране",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    emojiColor: "bg-green-100",
    description:
      "Ако личните ви данни са неточни или непълни, имате право да поискате коригирането им без излишно забавяне.",
    howTo:
      "Много данни можете да редактирате директно в профила си. За останалите — пишете на privacy@herobook.bg.",
  },
  {
    emoji: "🗑️",
    title: "Право на изтриване",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    emojiColor: "bg-red-100",
    description:
      'Известно като \u201Eправо да бъдете забравени\u201C — можете да поискате изтриване на личните ви данни, когато вече не са необходими за целите, за които са събрани, или когато оттеглите съгласието си.',
    howTo:
      'Пишете на privacy@herobook.bg с тема \u201EИскане за изтриване\u201C. Данни, за чието съхранение имаме законово задължение, не могат да бъдат изтрити преди изтичане на съответния срок.',
  },
  {
    emoji: "⏸️",
    title: "Право на ограничаване на обработването",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    emojiColor: "bg-yellow-100",
    description:
      "При определени обстоятелства (например оспорвате точността на данните или сте подали възражение) можете да поискате ограничаване на обработването, докато исканeто бъде разгледано.",
    howTo:
      "Свържете се с privacy@herobook.bg, като опишете причината за искането.",
  },
  {
    emoji: "📦",
    title: "Право на преносимост на данните",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    emojiColor: "bg-purple-100",
    description:
      "Имате право да получите личните си данни в структуриран, широко използван и машинночетим формат (JSON / CSV), и да ги прехвърлите към друг администратор.",
    howTo:
      'Изпратете искане на privacy@herobook.bg с тема \u201EПреносимост на данни\u201C. Ще подготвим архив в срок до 30 дни.',
  },
  {
    emoji: "🚫",
    title: "Право на възражение",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    emojiColor: "bg-orange-100",
    description:
      'Можете да се противопоставите на обработването на личните ви данни на основание \u201Eлегитимен интерес\u201C или за целите на директния маркетинг. При директен маркетинг имате абсолютно право на възражение.',
    howTo:
      'За маркетингови имейли използвайте линка \u201EОтпиши се\u201C в имейла. За останалите случаи — пишете на privacy@herobook.bg.',
  },
  {
    emoji: "🤖",
    title: "Права при автоматизирано решение",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    emojiColor: "bg-gray-100",
    description:
      "Имате право да не бъдете обект на решение, основано единствено на автоматизирано обработване (включително профилиране), което поражда правни последици или ви засяга в значителна степен.",
    howTo:
      "HeroBook не взема автоматизирани решения с правни последици. При въпроси — privacy@herobook.bg.",
  },
  {
    emoji: "📋",
    title: "Право на жалба до надзорен орган",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    emojiColor: "bg-teal-100",
    description:
      "Ако считате, че обработването на личните ви данни нарушава GDPR, имате право да подадете жалба до надзорния орган в страната, в която живеете, работите или където е извършено нарушението.",
    howTo:
      "В България надзорният орган е КЗЛД. Подробности са дадени по-долу. Можете също да ни пишете на privacy@herobook.bg — ще положим всички усилия да разрешим проблема.",
  },
];

export default function GdprPage() {
  return (
    <main className="min-h-screen bg-[#FDF6EC]">
      {/* Hero */}
      <section className="bg-[#FF6B35] py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Вашите права по GDPR
        </h1>
        <p className="text-orange-100 text-lg max-w-2xl mx-auto">
          В HeroBook вярваме, че поверителността е фундаментално право.
          Тук ще намерите изчерпателна информация за правата ви съгласно
          Регламент (ЕС) 2016/679.
        </p>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Какво е GDPR?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>Общият регламент за защита на данните (GDPR)</strong> е
            европейски закон, в сила от 25 май 2018 г., който регулира
            обработването на лични данни на граждани на ЕС. Той дава на
            хората реален контрол върху техните данни и налага строги
            задължения на организациите, които ги обработват.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            България транспонира GDPR чрез{" "}
            <strong>Закона за защита на личните данни (ЗЗЛД)</strong>.
            Надзорен орган в България е{" "}
            <strong>
              Комисията за защита на личните данни (КЗЛД)
            </strong>
            .
          </p>
          <p className="text-gray-700 leading-relaxed">
            Като администратор на данни, HeroBook ЕООД се ангажира да спазва
            изцяло изискванията на GDPR и да улесни упражняването на вашите
            права. По-долу е описано всяко от осемте основни права.
          </p>
        </div>

        {/* Rights cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {rights.map((right) => (
            <div
              key={right.title}
              className={`rounded-2xl border ${right.borderColor} ${right.bgColor} p-6 flex flex-col`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-full ${right.emojiColor} flex items-center justify-center text-2xl flex-shrink-0`}
                >
                  {right.emoji}
                </div>
                <h3 className="font-bold text-gray-800 text-base leading-snug">
                  {right.title}
                </h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-1">
                {right.description}
              </p>
              <div className="bg-white rounded-lg px-4 py-3 border border-white/60">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Как да упражните правото
                </p>
                <p className="text-sm text-gray-700">{right.howTo}</p>
              </div>
            </div>
          ))}
        </div>

        {/* How to exercise rights — 3 steps */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Как да упражните правата си
          </h2>
          <p className="text-gray-600 mb-8">
            Процесът е прост и безплатен. Следвайте тези три стъпки:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Изпратете имейл",
                desc: (
                  <>
                    Напишете до{" "}
                    <a
                      href="mailto:privacy@herobook.bg"
                      className="text-[#FF6B35] hover:underline font-medium"
                    >
                      privacy@herobook.bg
                    </a>
                    , като посочите своето искане и данните, за които се
                    отнася то.
                  </>
                ),
              },
              {
                step: "2",
                title: "Потвърждение на самоличността",
                desc: "Ще поискаме кратко потвърждение на вашата самоличност, за да защитим данните ви от неоторизиран достъп.",
              },
              {
                step: "3",
                title: "Отговор в срок до 30 дни",
                desc: "Ще изпълним вашето искане или ще ви обясним причините, поради които не можем да го направим, в срок до 30 дни от получаването.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 bg-[#FF6B35] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-gray-700 text-sm">
              Упражняването на правата е <strong>безплатно</strong>. При
              явно неоснователни или прекомерни искания можем да наложим
              административна такса или да откажем изпълнение, като ви
              уведомим за причините.
            </p>
          </div>
        </div>

        {/* КЗЛД */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Надзорен орган — КЗЛД
          </h2>
          <p className="text-gray-700 mb-5">
            Ако не сте доволни от нашия отговор или считате, че обработването
            на данните ви нарушава GDPR, имате право да подадете жалба до
            Комисията за защита на личните данни:
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <p className="font-bold text-gray-800 text-lg mb-3">
              Комисия за защита на личните данни (КЗЛД)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              <div>
                <span className="font-semibold text-gray-600">Адрес:</span>
                <br />
                бул. „Проф. Цветан Лазаров" № 2
                <br />
                1592 София, България
              </div>
              <div>
                <span className="font-semibold text-gray-600">Контакт:</span>
                <br />
                Тел.: 02/91-53-518
                <br />
                Имейл:{" "}
                <a
                  href="mailto:kzld@cpdp.bg"
                  className="text-[#FF6B35] hover:underline"
                >
                  kzld@cpdp.bg
                </a>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-orange-200">
              <a
                href="https://www.cpdp.bg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FF6B35] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Посетете kzld.bg →
              </a>
            </div>
          </div>
        </div>

        {/* Privacy policy link */}
        <div className="bg-[#FF6B35] rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">
            Искате повече информация?
          </h2>
          <p className="text-orange-100 mb-5 text-sm max-w-md mx-auto">
            Нашата Политика за поверителност съдържа пълна информация за
            данните, които събираме, и как ги обработваме.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/privacy"
              className="inline-block bg-white text-[#FF6B35] font-bold px-6 py-2.5 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Политика за поверителност
            </Link>
            <a
              href="mailto:privacy@herobook.bg"
              className="inline-block bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-orange-700 transition-colors"
            >
              privacy@herobook.bg
            </a>
          </div>
          <p className="text-orange-200 text-xs mt-6">
            Последна актуализация: 01.01.2026 г.
          </p>
        </div>
      </section>
    </main>
  );
}
