"use client";

import { motion } from "framer-motion";
import { BookOpen, Camera, Sparkles } from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    number: "01",
    title: "Избери история и качи снимка",
    description:
      "Разгледай нашите красиви книжки и избери любимата история. След това качи 1–2 снимки на детето.",
    color: "bg-brand-teal-light",
    iconColor: "text-brand-teal",
    accentColor: "border-brand-teal",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "Виж персонализираната книжка",
    description:
      "Нашият AI поставя лицето на вашето дете в илюстрациите. Получаваш безплатен преглед на 4–6 страници преди покупка.",
    color: "bg-brand-orange/10",
    iconColor: "text-brand-orange",
    accentColor: "border-brand-orange",
  },
  {
    icon: Camera,
    number: "03",
    title: "Виж грейналата усмивка",
    description:
      "Поръчай дигитален PDF или твърда корица. Доставяме до 3–5 работни дни с Еконт или Спиди навсякъде в България.",
    color: "bg-brand-purple-light",
    iconColor: "text-[#9b5fc0]",
    accentColor: "border-[#d999ff]",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-bold uppercase tracking-widest text-brand-orange"
          >
            Три лесни стъпки
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 text-3xl font-black text-brand-brown sm:text-4xl"
          >
            Как работи?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-base leading-relaxed text-brand-brown-body"
          >
            За под 5 минути детето ви може да стане герой на своя собствена
            книжка. Без технически умения — просто снимка и малко вълшебство.
          </motion.p>
        </div>

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-14 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3"
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={item}>
              <div
                className={`relative h-full rounded-2xl border-2 ${step.accentColor}/30 ${step.color} p-7 transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(17,24,39,0.1)]`}
              >
                {/* Step number */}
                <span className="absolute right-5 top-4 text-5xl font-black text-brand-brown/5">
                  {step.number}
                </span>

                {/* Icon */}
                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm`}
                >
                  <step.icon className={`h-6 w-6 ${step.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-extrabold text-brand-brown">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-brand-brown-body">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Connector line on desktop */}
        <div
          aria-hidden
          className="mx-auto mt-2 hidden max-w-2xl items-center justify-between md:flex"
        >
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-0.5 flex-1 bg-gradient-to-r from-brand-gold/0 via-brand-gold to-brand-gold/0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
