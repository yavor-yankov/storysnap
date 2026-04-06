import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FDF6EC]">
      {/* Hero */}
      <section className="bg-[#FF6B35] py-14 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Политика за поверителност
        </h1>
        <p className="text-orange-100 text-base">
          Последна актуализация: 01.01.2026 г.
        </p>
      </section>

      {/* Body */}
      <section className="max-w-3xl mx-auto py-14 px-4 space-y-10">

        {/* Intro */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <p className="text-gray-700 leading-relaxed">
            <strong>HeroBook ЕООД</strong> („HeroBook", „ние", „нас") е администратор на
            лични данни по смисъла на Регламент (ЕС) 2016/679 (GDPR) и Закона за
            защита на личните данни. Настоящата политика описва какви данни
            събираме, защо ги събираме, как ги обработваме и какви права имате
            като субект на данни.
          </p>
        </div>

        {/* 1. Администратор */}
        <PolicySection title="1. Администратор на лични данни">
          <p>
            <strong>HeroBook ЕООД</strong>
            <br />
            ЕИК: 207XXXXXX
            <br />
            Адрес: бул. „Витоша" 42, ет. 3, 1000 София, България
            <br />
            Имейл за поверителност:{" "}
            <a href="mailto:privacy@herobook.bg" className="text-[#FF6B35] hover:underline">
              privacy@herobook.bg
            </a>
          </p>
        </PolicySection>

        {/* 2. Данни, които събираме */}
        <PolicySection title="2. Лични данни, които събираме">
          <p className="mb-3">Събираме следните категории лични данни:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Данни за акаунт:</strong> Имена и имейл адрес, предоставени
              при регистрация.
            </li>
            <li>
              <strong>Снимки на детето:</strong> Качени от вас снимки, използвани
              единствено за генериране на персонализираната книжка. Тези снимки
              съдържат биометрични данни и се третират с повишена защита.
            </li>
            <li>
              <strong>Данни за поръчка:</strong> Информация за поръчките —
              продукти, адрес за доставка, история на покупките.
            </li>
            <li>
              <strong>Платежни данни:</strong> Плащанията се обработват от{" "}
              <strong>Stripe, Inc.</strong> Ние не съхраняваме данни за карти.
              Получаваме само потвърждение за успешно плащане и идентификатор на
              транзакцията.
            </li>
            <li>
              <strong>Технически данни:</strong> IP адрес, вид на браузъра и
              устройството, дата и час на посещение — събирани автоматично за
              осигуряване на сигурността на услугата.
            </li>
          </ul>
        </PolicySection>

        {/* 3. Цел и основание */}
        <PolicySection title="3. Цел на обработването и правно основание">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-orange-50">
                  <th className="text-left px-4 py-2 border border-orange-100 font-semibold text-gray-700">
                    Цел
                  </th>
                  <th className="text-left px-4 py-2 border border-orange-100 font-semibold text-gray-700">
                    Правно основание
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr>
                  <td className="px-4 py-2 border border-orange-100">
                    Генериране на персонализирана книжка с AI
                  </td>
                  <td className="px-4 py-2 border border-orange-100">
                    Изпълнение на договор (чл. 6(1)(б) GDPR)
                  </td>
                </tr>
                <tr className="bg-orange-50/40">
                  <td className="px-4 py-2 border border-orange-100">
                    Обработка на плащания и изпълнение на поръчки
                  </td>
                  <td className="px-4 py-2 border border-orange-100">
                    Изпълнение на договор (чл. 6(1)(б) GDPR)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-orange-100">
                    Имейл уведомления за поръчката
                  </td>
                  <td className="px-4 py-2 border border-orange-100">
                    Изпълнение на договор (чл. 6(1)(б) GDPR)
                  </td>
                </tr>
                <tr className="bg-orange-50/40">
                  <td className="px-4 py-2 border border-orange-100">
                    Маркетингови имейли (с абонамент)
                  </td>
                  <td className="px-4 py-2 border border-orange-100">
                    Съгласие (чл. 6(1)(а) GDPR) — можете да се отпишете по всяко
                    време
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-orange-100">
                    Спазване на счетоводни и данъчни задължения
                  </td>
                  <td className="px-4 py-2 border border-orange-100">
                    Законово задължение (чл. 6(1)(в) GDPR)
                  </td>
                </tr>
                <tr className="bg-orange-50/40">
                  <td className="px-4 py-2 border border-orange-100">
                    Сигурност и предотвратяване на злоупотреби
                  </td>
                  <td className="px-4 py-2 border border-orange-100">
                    Легитимен интерес (чл. 6(1)(е) GDPR)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </PolicySection>

        {/* 4. Срок за съхранение */}
        <PolicySection title="4. Срок за съхранение на данните">
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Снимки на детето:</strong> Изтриват се автоматично{" "}
              <strong>30 дни</strong> след генерирането на книжката. Можете да
              поискате незабавното им изтриване по всяко време.
            </li>
            <li>
              <strong>Данни за поръчка:</strong> Съхраняват се{" "}
              <strong>5 години</strong> съгласно изискванията на Закона за
              счетоводството (чл. 12 ЗС).
            </li>
            <li>
              <strong>Акаунт данни:</strong> Съхраняват се докато акаунтът е
              активен. При изтриване на акаунт — изтриват се в срок от 30 дни.
            </li>
            <li>
              <strong>Маркетингови данни:</strong> До оттегляне на съгласието.
            </li>
          </ul>
        </PolicySection>

        {/* 5. Получатели */}
        <PolicySection title="5. Получатели и трети страни">
          <p className="mb-3 text-gray-700">
            Споделяме лични данни само с доверени партньори, необходими за
            предоставяне на услугата:
          </p>
          <div className="space-y-3">
            {[
              {
                name: "Stripe, Inc.",
                role: "Обработка на плащания",
                location: "САЩ (стандартни договорни клаузи)",
                url: "https://stripe.com/privacy",
              },
              {
                name: "Supabase, Inc.",
                role: "База данни и съхранение на файлове",
                location: "ЕС (регион EU West)",
                url: "https://supabase.com/privacy",
              },
              {
                name: "Replicate, Inc.",
                role: "AI генерация на изображения",
                location: "САЩ (стандартни договорни клаузи)",
                url: "https://replicate.com/privacy",
              },
              {
                name: "Resend, Inc.",
                role: "Изпращане на имейли",
                location: "САЩ (стандартни договорни клаузи)",
                url: "https://resend.com/privacy",
              },
            ].map((p) => (
              <div
                key={p.name}
                className="bg-orange-50 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
              >
                <div>
                  <span className="font-semibold text-gray-800">{p.name}</span>
                  <span className="text-gray-600 text-sm"> — {p.role}</span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-3">
                  <span>{p.location}</span>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6B35] hover:underline"
                  >
                    Политика
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-gray-600 text-sm">
            Не продаваме лични данни на трети страни и не ги предоставяме за
            рекламни цели.
          </p>
        </PolicySection>

        {/* 6. Бисквитки */}
        <PolicySection title="6. Бисквитки (Cookies)">
          <p className="text-gray-700 mb-3">
            Използваме единствено <strong>задължителни бисквитки</strong>,
            необходими за функционирането на уебсайта (сесия, автентикация,
            сигурност). Не използваме проследяващи или рекламни бисквитки.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-orange-50">
                  <th className="text-left px-4 py-2 border border-orange-100 font-semibold text-gray-700">
                    Бисквитка
                  </th>
                  <th className="text-left px-4 py-2 border border-orange-100 font-semibold text-gray-700">
                    Цел
                  </th>
                  <th className="text-left px-4 py-2 border border-orange-100 font-semibold text-gray-700">
                    Срок
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr>
                  <td className="px-4 py-2 border border-orange-100 font-mono text-xs">
                    sb-auth-token
                  </td>
                  <td className="px-4 py-2 border border-orange-100">
                    Автентикация (Supabase)
                  </td>
                  <td className="px-4 py-2 border border-orange-100">
                    Сесия
                  </td>
                </tr>
                <tr className="bg-orange-50/40">
                  <td className="px-4 py-2 border border-orange-100 font-mono text-xs">
                    herobook-csrf
                  </td>
                  <td className="px-4 py-2 border border-orange-100">
                    Защита от CSRF атаки
                  </td>
                  <td className="px-4 py-2 border border-orange-100">
                    Сесия
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </PolicySection>

        {/* 7. Права на субекта */}
        <PolicySection title="7. Вашите права">
          <p className="text-gray-700 mb-3">
            Съгласно GDPR имате следните права по отношение на вашите лични данни:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Право на достъп</strong> — да получите копие от данните, които
              обработваме за вас.
            </li>
            <li>
              <strong>Право на коригиране</strong> — да поискате корекция на
              неточни данни.
            </li>
            <li>
              <strong>Право на изтриване</strong> — да поискате изтриване на
              вашите данни („право да бъдете забравени"), при условие че не
              съществува законово задължение за съхранение.
            </li>
            <li>
              <strong>Право на ограничаване на обработването</strong> — при
              определени обстоятелства.
            </li>
            <li>
              <strong>Право на преносимост</strong> — да получите данните си в
              структуриран, машинночетим формат.
            </li>
            <li>
              <strong>Право на възражение</strong> — срещу обработване на база
              легитимен интерес или за директен маркетинг.
            </li>
            <li>
              <strong>Право на оттегляне на съгласие</strong> — по всяко време,
              без това да засяга законосъобразността на предходното обработване.
            </li>
          </ul>
          <p className="mt-4 text-gray-700">
            За упражняване на правата си, моля, свържете се с нас на{" "}
            <a href="mailto:privacy@herobook.bg" className="text-[#FF6B35] hover:underline">
              privacy@herobook.bg
            </a>
            . Ще отговорим в срок до <strong>30 дни</strong>.
          </p>
          <p className="mt-2 text-gray-700">
            Подробно описание на всяко право е налично на нашата{" "}
            <Link href="/gdpr" className="text-[#FF6B35] hover:underline">
              GDPR страница
            </Link>
            .
          </p>
        </PolicySection>

        {/* 8. Надзорен орган */}
        <PolicySection title="8. Надзорен орган">
          <p className="text-gray-700">
            Ако считате, че обработването на вашите данни нарушава GDPR, имате
            право да подадете жалба до надзорния орган в България:
          </p>
          <div className="mt-4 bg-orange-50 rounded-lg px-5 py-4">
            <p className="font-semibold text-gray-800">
              Комисия за защита на личните данни (КЗЛД)
            </p>
            <p className="text-gray-600 text-sm mt-1">
              бул. „Проф. Цветан Лазаров" № 2, 1592 София
            </p>
            <p className="text-gray-600 text-sm">
              Тел.: 02/91-53-518 | Имейл: kzld@cpdp.bg
            </p>
            <a
              href="https://www.cpdp.bg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF6B35] hover:underline text-sm mt-1 inline-block"
            >
              www.cpdp.bg
            </a>
          </div>
        </PolicySection>

        {/* 9. Сигурност */}
        <PolicySection title="9. Сигурност на данните">
          <p className="text-gray-700">
            Прилагаме подходящи технически и организационни мерки за защита на
            личните данни от неоторизиран достъп, загуба или унищожаване.
            Данните се предават криптирано (TLS/HTTPS). Достъпът до лични данни
            е ограничен само до служители, за които е необходимо.
          </p>
        </PolicySection>

        {/* 10. Промени */}
        <PolicySection title="10. Промени в политиката">
          <p className="text-gray-700">
            При съществени промени ще ви уведомим по имейл или чрез банер на
            сайта. Датата на последна актуализация е посочена в началото на
            документа. Препоръчваме периодично да преглеждате тази политика.
          </p>
        </PolicySection>

        {/* Contact */}
        <div className="bg-[#FF6B35] rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">Въпроси относно поверителността?</h2>
          <p className="text-orange-100 mb-4 text-sm">
            Свържете се с нашия екип за защита на данните.
          </p>
          <a
            href="mailto:privacy@herobook.bg"
            className="inline-block bg-white text-[#FF6B35] font-bold px-6 py-2.5 rounded-lg hover:bg-orange-50 transition-colors"
          >
            privacy@herobook.bg
          </a>
        </div>
      </section>
    </main>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-orange-100">
        {title}
      </h2>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}
