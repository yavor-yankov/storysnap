"use client";

import { useState } from "react";
import Link from "next/link";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#FDF6EC]">
      {/* Hero */}
      <section className="bg-[#FF6B35] py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Свържи се с нас
        </h1>
        <p className="text-orange-100 text-lg max-w-xl mx-auto">
          Имаш въпрос или нужда от помощ? Нашият екип е на твое разположение.
        </p>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left — contact info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Информация за контакт
            </h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-[#FF6B35] font-bold text-lg">
                  @
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                    Имейл
                  </p>
                  <a
                    href="mailto:hello@herobook.bg"
                    className="text-[#FF6B35] font-semibold hover:underline"
                  >
                    hello@herobook.bg
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-[#FF6B35] font-bold text-lg">
                  &#9201;
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                    Работно време
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Понеделник – Петък, 9:00–18:00 ч.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-[#FF6B35] font-bold text-lg">
                  &#9993;
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                    Време за отговор
                  </p>
                  <p className="text-gray-800 font-semibold">до 24 часа</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-[#FF6B35] font-bold text-lg">
                  &#8962;
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                    Адрес
                  </p>
                  <p className="text-gray-800 font-semibold">
                    HeroBook ЕООД
                    <br />
                    бул. „Витоша" 42, ет. 3
                    <br />
                    1000 София, България
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ link */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
            <p className="text-gray-700 font-medium mb-2">
              Търсиш бърз отговор?
            </p>
            <p className="text-gray-500 text-sm mb-3">
              Провери нашите често задавани въпроси — може вече да имаме
              отговора.
            </p>
            <Link
              href="/faq"
              className="inline-block bg-[#FF6B35] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Към ЧЗВ →
            </Link>
          </div>

          {/* Social links */}
          <div>
            <p className="text-gray-700 font-semibold mb-3">
              Последвай ни в социалните мрежи
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/herobook.bg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors shadow-sm"
              >
                <span className="text-lg">&#128247;</span>
                Instagram
              </a>
              <a
                href="https://www.facebook.com/herobook.bg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors shadow-sm"
              >
                <span className="text-lg">&#128172;</span>
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Right — contact form */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mb-4">
                &#10003;
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Благодаря!
              </h3>
              <p className="text-gray-600">
                Ще се свържем с вас в рамките на 24 часа.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", subject: "", message: "" });
                }}
                className="mt-6 text-sm text-[#FF6B35] hover:underline"
              >
                Изпрати ново съобщение
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Изпрати съобщение
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Име <span className="text-[#FF6B35]">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Вашето пълно име"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Имейл <span className="text-[#FF6B35]">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Тема <span className="text-[#FF6B35]">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition"
                  >
                    <option value="" disabled>
                      Изберете тема
                    </option>
                    <option value="order">Въпрос за поръчка</option>
                    <option value="technical">Технически проблем</option>
                    <option value="partnership">Партньорство</option>
                    <option value="other">Друго</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Съобщение <span className="text-[#FF6B35]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Опишете вашия въпрос или проблем..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF6B35] text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-sm text-base"
                >
                  Изпрати съобщение
                </button>

                <p className="text-xs text-gray-400 text-center">
                  С изпращането на формата се съгласявате с нашата{" "}
                  <Link href="/privacy" className="text-[#FF6B35] hover:underline">
                    Политика за поверителност
                  </Link>
                  .
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
