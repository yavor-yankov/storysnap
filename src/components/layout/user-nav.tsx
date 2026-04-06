"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, BookOpen, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function UserNav() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Stay in sync with auth changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  if (!user) {
    return (
      <Link href="/auth/login">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 rounded-xl font-semibold text-brand-brown-sub hover:bg-brand-gold/30"
        >
          <User className="h-4 w-4" />
          Вход
        </Button>
      </Link>
    );
  }

  // Logged-in state
  const initials = user.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold text-brand-brown-sub transition-colors hover:bg-brand-gold/30"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange text-xs font-black text-white">
          {initials}
        </div>
        <span className="hidden xl:block max-w-[120px] truncate">{user.email}</span>
      </button>

      {menuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-10 z-50 w-52 rounded-2xl bg-white p-2 shadow-[0_8px_32px_rgba(17,24,39,0.12)] border border-brand-gold/20">
            <div className="px-3 py-2 text-xs text-brand-brown-body truncate border-b border-brand-gold/20 mb-1">
              {user.email}
            </div>
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-brand-brown-sub hover:bg-brand-gold/20 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Моите книжки
            </Link>
            <Link
              href="/stories"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-brand-brown-sub hover:bg-brand-gold/20 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Нова книжка
            </Link>
            <div className="my-1 h-px bg-brand-gold/20" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Изход
            </button>
          </div>
        </>
      )}
    </div>
  );
}
