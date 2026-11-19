import { Mail, Menu, Moon, ShieldCheck, Sun, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Theme } from "./use-theme";

const NAV = [
  { href: "#detector", label: "Detector" },
  { href: "#samples", label: "Samples" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#about", label: "About" },
];

export function SiteHeader({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-[var(--shadow-card)]">
            <Mail className="h-4.5 w-4.5" />
            <ShieldCheck className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-background p-0.5 text-safe" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            Email Spam Detector
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-xl"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="animate-fade-up border-t border-border bg-background px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
