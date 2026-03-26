import Link from "next/link"
import { BookOpen, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                PixTales
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transform your portrait into a beautifully illustrated personalized story book with AI.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Art Styles
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 PixTales. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 fill-current text-pink-500" /> using AI
          </p>
        </div>
      </div>
    </footer>
  )
}
