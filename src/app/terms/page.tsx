import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FDF6EC]">
      {/* Hero */}
      <section className="bg-[#FF6B35] py-14 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Общи условия
        </h1>
        <p className="text-orange-100 text-base">
          Последна актуализация: 01.01.2026 г.
        </p>
      </section>

      {/* Body */}
      <section className="max-w-3xl mx-auto py-14 px-4 space-y-8">

        {/* Intro */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <p className="text-gray-700 leading-relaxed">
            Настоящите общи условия уреждат отношенията между{" "}
            <strong>HeroBook ЕООД</strong> и потребителите на платформата
            HeroBook.bg. Моля, прочетете ги внимателно, преди да направите
            поръчка. С извършването на поръчка потвърждавате, че сте прочели,
            разбрали и приемате тези условия.
          </p>
        </div>

        {/* 1. Компания */}
        <TermsSection title="1. Информация за търговеца">
          <p>
            <strong>HeroBook ЕООД</strong>
            <br />
            ЕИК: 207XXXXXX
            <br />
            Адрес: бул. „Витоша" 42, ет. 3, 1000 София, България
            <br />
            Имейл:{" "}
            <a href="mailto:legal@herobook.bg" className="text-[#FF6B35] hover:underline">
              legal@herobook.bg
            </a>
            <br />
            Уебсайт: HeroBook.bg
            <br />
            Регистриран по ДДС: BG207XXXXXX
          </p>
        </TermsSection>

        {/* 2. Дефиниции */}
        <TermsSection title="2. Определения">
          <dl className="space-y-3">
            {[
              {
                term: "Потребител",
                def: "Всяко физическо или юридическо лице, което ползва услугите на HeroBook.bg.",
              },
              {
                term: "Книжка",
                def: "Персонализирана детска книга, генерирана с помощта на изкуствен интелект въз основа на предоставени от потребителя снимки и данни.",
              },
              {
                term: "Поръчка",
                def: "Заявка, направена от потребител за закупуване на дигитална или печатна книжка, потвърдена след успешно плащане.",
              },
              {
                term: "AI Генерация",
                def: "Процесът на автоматично създаване на персонализирани илюстрации и текст с помощта на технологии за изкуствен интелект.",
              },
              {
                term: "Дигитален продукт",
                def: "Книжка, предоставена в PDF формат за изтегляне.",
              },
              {
                term: "Печатен продукт",
                def: "Физически екземпляр на книжката, доставен по куриер.",
              },
            ].map((item) => (
              <div key={item.term} className="flex gap-2">
                <dt className="font-semibold text-gray-800 min-w-[140px] flex-shrink-0">
                  {item.term}:
                </dt>
                <dd className="text-gray-700">{item.def}</dd>
              </div>
            ))}
          </dl>
        </TermsSection>

        {/* 3. Услуга */}
        <TermsSection title="3. Описание на услугата">
          <p className="mb-3">
            HeroBook.bg предоставя платформа за създаване на персонализирани
            детски книги с технологии за изкуствен интелект. Потребителят качва
            снимки на дете, избира история и получава книжка, в която детето е
            главният герой.
          </p>
          <p className="mb-3">
            Книжките се предлагат в два формата:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>
              <strong>Дигитален PDF</strong> — достъпен за изтегляне веднага
              след генерирането.
            </li>
            <li>
              <strong>Печатна книжка</strong> — твърди корици, висококачествен
              печат, доставена по куриер до 3–5 работни дни.
            </li>
          </ul>
        </TermsSection>

        {/* 4. Поръчки */}
        <TermsSection title="4. Поръчки и потвърждение">
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              Поръчката се счита за потвърдена след успешно обработване на
              плащането.
            </li>
            <li>
              При потвърждение на поръчката изпращаме имейл потвърждение с
              детайли.
            </li>
            <li>
              <strong>Дигиталният PDF</strong> се генерира и предоставя за
              изтегляне веднага след потвърждение на плащането.
            </li>
            <li>
              <strong>Печатната книжка</strong> се изпраща в срок от{" "}
              <strong>3–5 работни дни</strong> след потвърждение. Доставката е
              за сметка на потребителя, освен ако не е указано друго.
            </li>
            <li>
              Запазваме си правото да откажем поръчка при съмнение за измама
              или нарушение на настоящите условия.
            </li>
          </ul>
        </TermsSection>

        {/* 5. Цени */}
        <TermsSection title="5. Цени и плащане">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-orange-50 rounded-xl p-5 text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">
                Дигитален PDF
              </p>
              <p className="text-3xl font-bold text-[#FF6B35]">9.90 лв</p>
              <p className="text-xs text-gray-500 mt-1">с ДДС</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-5 text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">
                Печатна книжка
              </p>
              <p className="text-3xl font-bold text-[#FF6B35]">34.00 лв</p>
              <p className="text-xs text-gray-500 mt-1">с ДДС</p>
            </div>
          </div>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Всички цени са в български лева (BGN) и включват ДДС.</li>
            <li>
              Плащанията се обработват сигурно чрез{" "}
              <strong>Stripe</strong> — поддържат се всички основни карти
              (Visa, Mastercard, American Express).
            </li>
            <li>
              Запазваме си правото да актуализираме цените по всяко време.
              Промените не засягат вече направени поръчки.
            </li>
          </ul>
        </TermsSection>

        {/* 6. Отказ и върнане */}
        <TermsSection title="6. Право на отказ и връщане">
          <div className="space-y-4 text-gray-700">
            <div className="border-l-4 border-[#FF6B35] pl-4">
              <p className="font-semibold text-gray-800 mb-1">Дигитален продукт</p>
              <p>
                Съгласно чл. 57, т. 13 от Закона за защита на потребителите,{" "}
                <strong>
                  не е възможен отказ от дигитален продукт след неговото
                  изтегляне или стриймване
                </strong>
                . Потребителят изрично се съгласява с това при потвърждение на
                поръчката. Ако PDF-ът не е изтеглен, можете да се свържете с
                нас за отказ в рамките на 14 дни.
              </p>
            </div>
            <div className="border-l-4 border-orange-300 pl-4">
              <p className="font-semibold text-gray-800 mb-1">Печатен продукт</p>
              <p>
                Можете да откажете поръчката за печатна книжка{" "}
                <strong>преди изпращането й</strong>. След изпращане важи
                стандартното 14-дневно право на отказ при неотваряно и
                непокътнато изделие.
              </p>
            </div>
          </div>
        </TermsSection>

        {/* 7. Гаранция */}
        <TermsSection title="7. Гаранция за качество">
          <p className="text-gray-700">
            При установен дефект в качеството на печатната книжка (некачествен
            печат, повредени корици, дефектни страници) предлагаме{" "}
            <strong>безплатна замяна или пълно възстановяване на сумата</strong>{" "}
            в рамките на <strong>30 дни</strong> от получаването. Моля,
            изпратете снимка на дефекта на{" "}
            <a href="mailto:hello@herobook.bg" className="text-[#FF6B35] hover:underline">
              hello@herobook.bg
            </a>
            . Дефекти, причинени от неправилно ползване или умишлена повреда, не
            се покриват.
          </p>
        </TermsSection>

        {/* 8. Интелектуална собственост */}
        <TermsSection title="8. Интелектуална собственост">
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Снимките</strong>, качени от потребителя, остават
              негова собственост. Потребителят ни предоставя ограничен лиценз
              за тяхното ползване единствено с цел генериране на книжката.
            </li>
            <li>
              <strong>Генерираните илюстрации и текст</strong> на книжката са
              собственост на HeroBook ЕООД. На потребителя се предоставя
              личен, непрехвърляем лиценз за лично ползване.
            </li>
            <li>
              Марката „HeroBook", логото и дизайнът на платформата са
              защитени търговски марки на HeroBook ЕООД.
            </li>
          </ul>
        </TermsSection>

        {/* 9. Забранени употреби */}
        <TermsSection title="9. Забранени употреби">
          <p className="mb-2 text-gray-700">Забранено е:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>
              Търговска препродажба или преразпределение на генерираните книжки.
            </li>
            <li>
              Качване на снимки на лица без тяхното (или родителско)
              съгласие.
            </li>
            <li>
              Използване на платформата за генериране на незаконно, обидно или
              вредно съдържание.
            </li>
            <li>
              Автоматизиран достъп до платформата (scraping, bot трафик) без
              изрично разрешение.
            </li>
            <li>
              Опити за заобикаляне на системите за сигурност или
              автентикация.
            </li>
          </ul>
        </TermsSection>

        {/* 10. Ограничаване на отговорността */}
        <TermsSection title="10. Ограничаване на отговорността">
          <div className="space-y-3 text-gray-700">
            <p>
              HeroBook ЕООД не носи отговорност за:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Неточности, артефакти или несъответствия в AI-генерираните
                изображения. Изкуственият интелект не гарантира перфектно
                сходство с предоставените снимки.
              </li>
              <li>
                Временна недостъпност на платформата поради техническа
                поддръжка или обстоятелства извън нашия контрол.
              </li>
              <li>
                Вреди, причинени от неправомерно ползване на платформата от
                трети лица.
              </li>
              <li>
                Индиректни или последващи щети, включително пропуснати ползи.
              </li>
            </ul>
            <p>
              Нашата отговорност е ограничена до стойността на поръчката.
            </p>
          </div>
        </TermsSection>

        {/* 11. Приложимо право */}
        <TermsSection title="11. Приложимо право и разрешаване на спорове">
          <div className="space-y-3 text-gray-700">
            <p>
              Настоящите условия се уреждат от{" "}
              <strong>законодателството на Република България</strong>.
            </p>
            <p>
              При спорове препоръчваме първо да се свържете с нас на{" "}
              <a href="mailto:legal@herobook.bg" className="text-[#FF6B35] hover:underline">
                legal@herobook.bg
              </a>{" "}
              за извънсъдебно уреждане.
            </p>
            <p>
              При невъзможност за постигане на споразумение, споровете се
              отнасят до компетентния съд в <strong>гр. София</strong>.
            </p>
            <p>
              Потребителите имат право да използват платформата за онлайн
              решаване на спорове на ЕС:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF6B35] hover:underline"
              >
                ec.europa.eu/consumers/odr
              </a>
            </p>
          </div>
        </TermsSection>

        {/* 12. Промени */}
        <TermsSection title="12. Промени в условията">
          <p className="text-gray-700">
            Запазваме си правото да актуализираме тези условия по всяко
            време. При съществени промени ще ви уведомим по имейл минимум{" "}
            <strong>14 дни преди влизането им в сила</strong>. Продължаването
            на ползването на услугата след влизане в сила на промените се счита
            за приемане на новите условия.
          </p>
        </TermsSection>

        {/* CTA */}
        <div className="bg-[#FF6B35] rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">Имате въпроси?</h2>
          <p className="text-orange-100 mb-4 text-sm">
            Нашият екип ще се радва да помогне.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:legal@herobook.bg"
              className="inline-block bg-white text-[#FF6B35] font-bold px-6 py-2.5 rounded-lg hover:bg-orange-50 transition-colors"
            >
              legal@herobook.bg
            </a>
            <Link
              href="/contact"
              className="inline-block bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Форма за контакт
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function TermsSection({
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
