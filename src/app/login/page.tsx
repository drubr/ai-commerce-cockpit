import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { getSession } from "@/lib/session";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Sign in" };
export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-7 lg:px-12">
        <Brand />
        <span className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <LockKeyhole className="size-3.5" />
          Secure workspace
        </span>
      </header>
      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-16 px-6 py-12 lg:px-12">
        <section className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <h1 className="mt-3 mb-2 text-center text-3xl font-semibold tracking-tight">
              Good to have you back.
            </h1>
            <p className="text-center">Sign in to manage your workspace.</p>
          </div>
          <LoginForm />
        </section>
      </div>
      <footer className="flex flex-wrap justify-between gap-4 border-t px-6 py-5 text-sm text-muted-foreground lg:px-12">
        <span>
          © {new Date().getFullYear()} mediawave AI. All rights reserved.
        </span>
        <span>Made for better connections.</span>
      </footer>
    </main>
  );
}
