"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Табло", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Поръчки", icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-brand-brown text-white flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/admin" className="text-brand-orange font-extrabold text-xl tracking-tight">
            HeroBook
          </Link>
          <p className="text-white/40 text-xs mt-0.5">Администрация</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-orange text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Към сайта
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
