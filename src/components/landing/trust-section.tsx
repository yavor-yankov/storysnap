import { Shield, RefreshCcw, Truck, Heart, Award, Lock } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: RefreshCcw,
    title: "30 дни гаранция",
    description: "Не сте доволни? Връщаме парите без въпроси.",
  },
  {
    icon: Truck,
    title: "Безплатна доставка",
    description: "До всяка точка на България с Еконт и Спиди.",
  },
  {
    icon: Heart,
    title: "Произведено в България",
    description: "Печатаме и опаковаме с любов в нашата страна.",
  },
  {
    icon: Award,
    title: "Премиум качество",
    description: "Твърда корица, плотна хартия, ярки цветове.",
  },
  {
    icon: Lock,
    title: "Защита на данните",
    description: "Снимките са криптирани и изтрити след 30 дни.",
  },
  {
    icon: Shield,
    title: "Наложен платеж",
    description: "Плащате при доставка — без риск за вас.",
  },
];

export function TrustSection() {
  return (
    <section className="bg-brand-brown py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stat line */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-8 text-center sm:gap-16">
          {[
            { value: "500+", label: "Щастливи деца" },
            { value: "4.9", label: "Средна оценка ⭐" },
            { value: "48ч", label: "Средна доставка" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-black text-white">{value}</p>
              <p className="mt-1 text-sm font-semibold text-brand-gold/80">{label}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mb-12 h-px bg-white/10" />

        {/* Trust grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/15">
                <Icon className="h-6 w-6 text-brand-orange" />
              </div>
              <h3 className="mt-3 text-sm font-extrabold text-white">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-white/55">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
