"use client";

import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";

type FormDataValues = {
  email: string;
  password: string;
};

type FormErrors = Partial<FormDataValues>;

function validate(data: FormDataValues): FormErrors {
  const nextErrors: FormErrors = {};
  if (!data.email.trim()) nextErrors.email = "Email address is required.";
  else if (!/^\S+@\S+\.\S+$/.test(data.email.trim()))
    nextErrors.email = "Email address is not valid.";
  if (!data.password.trim()) nextErrors.password = "Password is required.";
  return nextErrors;
}

export function SignInForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as FormDataValues & {
      rememberMe: string;
    };
    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setFormError(null);
    setSubmitting(true);

    try {
      const { error } = await signIn.email({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        rememberMe: data.rememberMe === "on",
      });

      if (error) {
        setFormError(
          error.code === "INVALID_EMAIL_OR_PASSWORD"
            ? "Invalid email or password."
            : (error.message ?? "Something went wrong. Try again."),
        );
        setSubmitting(false);
        return;
      }

      router.push("/destinations");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="h-9 bg-muted pl-8"
              aria-invalid={errors.email ? true : undefined}
            />
          </div>
          <FieldError
            errors={[errors.email ? { message: errors.email } : undefined]}
          />
        </Field>

        <Field data-invalid={errors.password ? true : undefined}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="h-9 bg-muted pl-8"
              aria-invalid={errors.password ? true : undefined}
            />
          </div>
          <FieldError
            errors={[
              errors.password ? { message: errors.password } : undefined,
            ]}
          />
        </Field>

        <div className="flex items-center justify-between pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="rememberMe"
              className="size-3.5 accent-cyan-500"
            />
            Remember me
          </label>
          <a
            href="/forgot-password"
            className="text-sm font-medium text-cyan-500 underline-offset-4 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {formError ? (
          <output className="text-sm font-medium text-destructive">
            {formError}
          </output>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="h-9 w-full rounded-lg bg-cyan-500 text-sm font-medium text-white transition-colors hover:bg-cyan-600 disabled:opacity-60"
        >
          {submitting ? "Signing In…" : "Sign In"}
        </button>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-border" />
          <p className="text-xs text-muted-foreground">Or continue with</p>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-border bg-white text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52"
            />
          </svg>
          Sign Up With Google
        </button>

        <p className="pt-2 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a
            href="/sign-up"
            className="font-medium text-cyan-500 underline-offset-4 hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </form>
  );
}
