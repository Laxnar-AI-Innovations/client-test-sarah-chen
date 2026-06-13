import { BUSINESS } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold">{BUSINESS.name}</p>
          <p className="text-sm text-muted-foreground">{BUSINESS.tagline}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>{BUSINESS.address}</p>
          <p>{BUSINESS.hours}</p>
          <p>
            {BUSINESS.email} · {BUSINESS.phone}
          </p>
        </div>
      </div>
    </footer>
  );
}
