"use client";

import { Check, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import type { Destination } from "./destination-card";

const bookingGuarantees = [
  "Best availability for your dates",
  "Free cancellation 24 hours",
  "24/7 customer support",
];

export function BookingSummary({ destination }: { destination: Destination }) {
  const { data: session, isPending } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"success" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleBook(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const departureDate = String(formData.get("departureDate") ?? "");

    if (!departureDate.trim()) {
      setError("Please pick a departure date.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: session?.user?.name,
          email: session?.user?.email,
          destinationName: destination.destinationName,
          country: destination.country,
          category: destination.categories,
          price: destination.price,
          duration: destination.duration,
          description: destination.description,
          departureDate,
        }),
      });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      setStatus("success");
    } catch (err) {
      setStatus(null);
      setError(
        err instanceof Error ? err.message : "Booking failed. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <aside className="mt-8 border-t border-dashed border-cyan-200 pt-6 lg:mt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        <Info className="size-3" />
        Starting From
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-4xl font-semibold text-cyan-600">
          ${destination.price}
        </p>
        <span className="text-xs text-muted-foreground">/PP</span>
      </div>
      {isPending ? null : session?.user ? (
        <form onSubmit={handleBook} noValidate>
          <p className="mt-6 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Departure Date
          </p>
          <input
            type="date"
            name="departureDate"
            className="mt-1.5 w-full border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {error ? (
            <output className="mt-3 block text-xs font-medium text-destructive">
              {error}
            </output>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 flex w-full items-center justify-between bg-cyan-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-cyan-700 disabled:opacity-60"
          >
            {submitting ? "Booking..." : "Book Now"}
          </button>
          {status === "success" ? (
            <output className="mt-3 block text-xs font-medium text-emerald-600">
              Booking request sent successfully.
            </output>
          ) : null}
        </form>
      ) : (
        <Link
          href="/sign-in"
          className="mt-6 flex w-full items-center justify-center border border-cyan-600 px-4 py-2.5 font-medium text-cyan-700 transition-colors hover:bg-cyan-50"
        >
          Login to book this trip
        </Link>
      )}
      <ul className="mt-4 space-y-2">
        {bookingGuarantees.map((guarantee) => (
          <li
            key={guarantee}
            className="flex items-start gap-2 text-xs text-muted-foreground"
          >
            <Check className="mt-0.5 size-3.5 shrink-0 text-cyan-600" />
            {guarantee}
          </li>
        ))}
      </ul>
    </aside>
  );
}
