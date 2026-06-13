import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AuthForm } from "@/components/auth-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default function SignupPage() {
  const configured = isSupabaseConfigured();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {!configured && (
          <Alert className="mb-6">
            <AlertTitle>Preview mode</AlertTitle>
            <AlertDescription>
              Client sign-up requires Supabase Auth. Use the booking flow for guest appointments.
            </AlertDescription>
          </Alert>
        )}
        {configured ? (
          <AuthForm mode="signup" />
        ) : (
          <Alert>
            <AlertTitle>Auth unavailable</AlertTitle>
            <AlertDescription>
              Configure Supabase env vars to enable account creation.
            </AlertDescription>
          </Alert>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
