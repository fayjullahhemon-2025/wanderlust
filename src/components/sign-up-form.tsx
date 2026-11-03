"use client";

import { Lock, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth-client";

type FormDataValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<FormDataValues>;

function validate(data: FormDataValues): FormErrors {
  const nextErrors: FormErrors = {};
  if (!data.fullName.trim()) nextErrors.fullName = "Full name is required.";
  if (!data.email.trim()) nextErrors.email = "Email address is required.";
  else if (!/^\S+@\S+\.\S+$/.test(data.email.trim()))
    nextErrors.email = "Email address is not valid.";
  if (!data.password.trim()) nextErrors.password = "Password is required.";
  else if (data.password.length < 8)
    nextErrors.password = "Password must be at least 8 characters.";
  if (!data.confirmPassword.trim())
    nextErrors.confirmPassword = "Please confirm your password.";
  else if (data.confirmPassword !== data.password)
    nextErrors.confirmPassword = "Passwords do not match.";
  return nextErrors;
}

export function SignUpForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as FormDataValues;
    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setFormError(null);
    setSubmitting(true);

    try {
      const { error } = await signUp.email({
        name: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (error) {
        setFormError(
          error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
            ? "An account with this email already exists."
            : (error.message ?? "Something went wrong. Try again."),
        );
        setSubmitting(false);
        return;
      }

      // A session is created immediately after email/password sign-up.
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
        <Field data-invalid={errors.fullName ? true : undefined}>
          <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
          <div className="relative">
            <UserRound className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="full-name"
              name="fullName"
              placeholder="Enter your name"
              className="h-9 bg-muted pl-8"
              aria-invalid={errors.fullName ? true : undefined}
            />
          </div>
          <FieldError
            errors={[
              errors.fullName ? { message: errors.fullName } : undefined,
            ]}
          />
        </Field>

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
              placeholder="Create a password"
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

        <Field data-invalid={errors.confirmPassword ? true : undefined}>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="h-9 bg-muted pl-8"
              aria-invalid={errors.confirmPassword ? true : undefined}
            />
          </div>
          <FieldError
            errors={[
              errors.confirmPassword
                ? { message: errors.confirmPassword }
                : undefined,
            ]}
          />
        </Field>

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
          {submitting ? "Creating Account…" : "Create Account"}
        </button>

        <p className="pt-2 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-cyan-500 underline-offset-4 hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </form>
  );
}
