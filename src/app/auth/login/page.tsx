import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AuthForm } from "@/components/auth-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default function LoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {!configured && (
          <Alert className="mb-6">
            <AlertTitle>Preview mode</AlertTitle>
            <AlertDescription>
              Add Supabase environment variables to enable email login. The admin dashboard is
              available in demo mode without auth.
            </AlertDescription>
          </Alert>
        )}
        {configured ? (
          <AuthForm mode="login" />
        ) : (
          <Alert>
            <AlertTitle>Auth unavailable</AlertTitle>
            <AlertDescription>
              Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then restart
              the dev server.
            </AlertDescription>
          </Alert>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
