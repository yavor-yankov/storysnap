"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
    });

    if (error) {
      setError("Нещо се обърка. Проверете имейла и опитайте отново.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange/10">
            <BookOpen className="h-7 w-7 text-brand-orange" />
          </div>
          <h1 className="text-2xl font-black text-brand-brown">
            Забравена парола
          </h1>
          <p className="mt-1 text-sm text-brand-brown-body">
            Ще изпратим линк за нулиране на паролата
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white p-8 shadow-[0_6px_24px_rgba(17,24,39,0.08)]">
          {sent ? (
            <div className="text-center py-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mx-auto mb-4 text-2xl">
                ✓
              </div>
              <h2 className="text-lg font-black text-brand-brown mb-2">
                Проверете имейла си
              </h2>
              <p className="text-sm text-brand-brown-body leading-relaxed mb-6">
                Изпратихме линк за нулиране на паролата на{" "}
                <strong className="text-brand-brown">{email}</strong>. Линкът е
                валиден 60 минути.
              </p>
              <p className="text-xs text-brand-brown-sub">
                Не получихте имейл?{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-brand-orange font-semibold hover:underline"
                >
                  Опитайте отново
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label
                  htmlFor="email"
                  className="font-semibold text-brand-brown-sub"
                >
                  Имейл адрес
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vashiyat@email.com"
                  required
                  className="mt-1.5 rounded-xl border-brand-brown/20 focus:border-brand-orange"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-[20px] bg-brand-orange font-bold text-white transition-all duration-200 hover:bg-brand-orange-hover disabled:opacity-60"
              >
                {loading ? "Изпращане..." : "Изпрати линк за нулиране"}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-brand-brown-body">
          Сетихте се за паролата?{" "}
          <Link
            href="/auth/login"
            className="font-bold text-brand-orange hover:underline"
          >
            Обратно към вход
          </Link>
        </p>
      </div>
    </div>
  );
}
