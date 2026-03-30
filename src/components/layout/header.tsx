"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, BookOpen, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/stories", label: "Книжки" },
  { href: "/how-it-works", label: "Как работи?" },
  { href: "/about", label: "За нас" },
  { href: "/faq", label: "Въпроси" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-gold/30 bg-brand-beige/95 backdrop-blur-md supports-[backdrop-filter]:bg-brand-beige/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <BookOpen className="h-7 w-7 text-brand-orange" strokeWidth={2.5} />
          <span className="text-xl font-black tracking-tight text-brand-brown">
            Hero<span className="text-brand-orange">Book</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-brand-brown-sub transition-colors hover:bg-brand-gold/30 hover:text-brand-brown"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
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
          <Link href="/stories">
            <Button
              size="sm"
              className="gap-2 rounded-[20px] bg-brand-orange font-bold text-white shadow-none transition-all duration-200 hover:bg-brand-orange-hover hover:shadow-md"
            >
              <ShoppingBag className="h-4 w-4" />
              Виж книжките
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="lg:hidden"
            render={
              <Button variant="ghost" size="icon" aria-label="Отвори менюто" />
            }
          >
            <Menu className="h-6 w-6 text-brand-brown" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-brand-beige p-0">
            <div className="flex flex-col gap-1 p-6 pt-12">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-brand-brown-sub transition-colors hover:bg-brand-gold/30 hover:text-brand-brown"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-4 h-px bg-brand-gold/40" />
              <Link href="/auth/login" onClick={() => setOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 rounded-xl font-semibold text-brand-brown-sub"
                >
                  <User className="h-4 w-4" />
                  Вход
                </Button>
              </Link>
              <Link href="/stories" onClick={() => setOpen(false)}>
                <Button className="mt-2 w-full rounded-[20px] bg-brand-orange font-bold text-white transition-all duration-200 hover:bg-brand-orange-hover">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Виж книжките
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
