import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </span>
          <span>Glow Spa</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/book"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Book
          </Link>
          <Button render={<Link href="/book" />} size="sm">
            Book now
          </Button>
        </nav>
      </div>
    </header>
  );
}
