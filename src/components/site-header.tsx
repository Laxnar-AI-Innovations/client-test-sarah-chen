import Link from "next/link";
import { Sparkles, Menu } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/book", label: "Book Now" },
  { href: "/auth/login", label: "Sign In" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </span>
          <span className="hidden sm:inline">{BUSINESS.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <LinkButton key={link.href} variant="ghost" href={link.href}>
              {link.label}
            </LinkButton>
          ))}
          <LinkButton href="/book" className="ml-2">
            Book Appointment
          </LinkButton>
        </nav>

        <Sheet>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "md:hidden",
            )}
          >
            <Menu className="size-4" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{BUSINESS.name}</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <LinkButton
                  key={link.href}
                  variant="ghost"
                  href={link.href}
                  className="justify-start"
                >
                  {link.label}
                </LinkButton>
              ))}
              <LinkButton href="/book" className="mt-2">
                Book Appointment
              </LinkButton>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
