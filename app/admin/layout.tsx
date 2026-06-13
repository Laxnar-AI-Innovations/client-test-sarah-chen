import Link from "next/link";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-muted/20">
      {user ? (
        <header className="border-b border-border/60 bg-background">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
            <div>
              <p className="text-sm text-muted-foreground">Glow Spa Admin</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <form action="/auth/signout" method="post">
              <Button variant="outline" size="sm" type="submit">
                <LogOut />
                Sign out
              </Button>
            </form>
          </div>
        </header>
      ) : null}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
      {!user ? (
        <p className="pb-8 text-center text-sm text-muted-foreground">
          <Link href="/" className="underline-offset-4 hover:underline">
            Return to public site
          </Link>
        </p>
      ) : null}
    </div>
  );
}
