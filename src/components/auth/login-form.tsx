"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailInput } from "./email-input";
import { PasswordInput } from "./password-input";

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"password" | "otp">("password");
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  function completeSignIn() {
    router.replace("/dashboard");
    router.refresh();
  }
  async function sendCode() {
    setNotice("");
    const result = await authClient.twoFactor.sendOtp({});
    if (result.error) {
      setError("Unable to send a code. Please try again shortly.");
    } else {
      setNotice(
        "Check your email for a six-digit code. It expires in 5 minutes.",
      );
      setCooldown(30);
    }
  }
  async function resend() {
    setPending(true);
    setError("");
    try {
      await sendCode();
    } catch {
      setError("Unable to send a code. Please try again shortly.");
    } finally {
      setPending(false);
    }
  }
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      if (step === "otp") {
        const result = await authClient.twoFactor.verifyOtp({ code });
        if (result.error) {
          setError(
            "The code is invalid or expired. Try again or request a new code.",
          );
        } else {
          completeSignIn();
        }
        return;
      }
      const result = await authClient.signIn.email({
        email: String(data.get("email")),
        password: String(data.get("password")),
      });
      if (result.error) {
        setError(
          result.error.status === 429
            ? "Too many attempts. Please wait a moment and try again."
            : "The email or password is incorrect. Please try again.",
        );
      } else if (
        result.data &&
        "twoFactorRedirect" in result.data &&
        result.data.twoFactorRedirect
      ) {
        setStep("otp");
        await sendCode();
      } else {
        completeSignIn();
      }
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-8">
      {step === "otp" ? (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Verify your sign-in</h3>
          <Label htmlFor="otp">Verification code</Label>
          <Input
            id="otp"
            name="otp"
            autoFocus
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            disabled={pending}
            onChange={(event) =>
              setCode(event.target.value.replace(/[^0-9]/g, ""))
            }
            className="h-11 text-center tracking-widest"
            aria-describedby="otp-help"
          />
          <p id="otp-help" className="text-sm text-muted-foreground">
            Enter the six-digit code sent to your work email.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <EmailInput
              id="email"
              name="email"
              placeholder="you@company.com"
              required
              className="h-11"
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              disabled={pending}
            />
          </div>
        </div>
      )}
      {notice && (
        <p role="status" className="text-sm text-muted-foreground">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button
        className="h-11 w-full justify-between px-4"
        type="submit"
        disabled={pending}
      >
        {pending
          ? "Please wait…"
          : step === "otp"
            ? "Verify and sign in"
            : "Sign in to workspace"}
        {pending ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}
      </Button>
      {step === "otp" && (
        <div className="flex justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            disabled={pending || cooldown > 0}
            onClick={resend}
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            onClick={() => {
              setStep("password");
              setCode("");
              setError("");
              setNotice("");
              setCooldown(0);
            }}
          >
            Back to sign in
          </Button>
        </div>
      )}
    </form>
  );
}
