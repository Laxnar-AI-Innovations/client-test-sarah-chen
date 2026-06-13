export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Glow Spa by Sarah Chen</p>
        <p>sarah@test.com · +91 98765 43210</p>
      </div>
    </footer>
  );
}
