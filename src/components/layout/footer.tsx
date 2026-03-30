import Link from "next/link";
import { BookOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  product: {
    title: "Продукти",
    links: [
      { href: "/stories", label: "Всички книжки" },
      { href: "/how-it-works", label: "Как работи?" },
      { href: "/pricing", label: "Цени" },
    ],
  },
  company: {
    title: "Компания",
    links: [
      { href: "/about", label: "За нас" },
      { href: "/faq", label: "Често задавани въпроси" },
      { href: "/contact", label: "Контакти" },
    ],
  },
  legal: {
    title: "Правна информация",
    links: [
      { href: "/privacy", label: "Поверителност" },
      { href: "/terms", label: "Общи условия" },
      { href: "/gdpr", label: "GDPR" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="border-t border-brand-gold/30 bg-brand-brown">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-brand-orange" strokeWidth={2.5} />
              <span className="text-xl font-black tracking-tight text-white">
                Hero<span className="text-brand-orange">Book</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-gold/80">
              Персонализирани детски книжки с лицето на вашето дете. Вълшебен
              подарък, произведен с любов в България.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-white">
                Спести 10% — запиши се за нашия бюлетин
              </p>
              <form className="mt-2 flex gap-2">
                <Input
                  type="email"
                  placeholder="Вашият имейл"
                  className="h-10 rounded-xl border-brand-gold/30 bg-white/10 text-sm text-white placeholder:text-brand-gold/50 focus:border-brand-orange"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl bg-brand-orange px-4 font-semibold text-white transition-all duration-200 hover:bg-brand-orange-hover"
                >
                  <Mail className="mr-1 h-4 w-4" />
                  Изпрати
                </Button>
              </form>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-brand-orange"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-white/50">
            <span>🇧🇬</span>
            <span>Произведено в България с ❤️</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/50 transition-colors hover:text-brand-orange"
            >
              {/* Instagram icon */}
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-white/50 transition-colors hover:text-brand-orange"
            >
              {/* Facebook icon */}
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} HeroBook. Всички права запазени.
          </p>
        </div>
      </div>
    </footer>
  );
}
