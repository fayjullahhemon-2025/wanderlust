"use client";

import {
  CalendarDays,
  CircleCheck,
  Clock,
  Eye,
  MapPin,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import type { Destination } from "./destination-card";

type Booking = {
  _id: string;
  email?: string;
  destinationName?: string;
  price?: number;
  departureDate?: string;
  status?: string;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDeparture(date?: string) {
  if (!date) return "—";
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;
  return `${months[month - 1]} ${day}, ${year}`;
}

function findBookedDestination(
  destinations: Destination[],
  booking: Booking,
): Destination | undefined {
  const name = booking.destinationName?.trim().toLowerCase();
  if (!name) return undefined;
  return destinations.find(
    (destination) => destination.destinationName.trim().toLowerCase() === name,
  );
}

export function MyBookings({ destinations }: { destinations: Destination[] }) {
  const { data: session, isPending } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      setLoading(false);
      return;
    }
    const email = session.user.email;
    if (!email) {
      setLoading(false);
      return;
    }
    let isActive = true;
    setLoading(true);
    setFailed(false);
    getTokenFromClient()
      .then((token) =>
        fetch(`http://localhost:5000/bookings/${encodeURIComponent(email)}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json() as Promise<Booking[]>;
      })
      .then((myBookings) => {
        if (isActive) {
          setBookings(myBookings);
        }
      })
      .catch(() => {
        if (isActive) {
          setFailed(true);
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });
    return () => {
      isActive = false;
    };
  }, [isPending, session]);

  async function handleCancel(booking: Booking) {
    setCancellingId(booking._id);
    try {
      await fetch(`http://localhost:5000/bookings/${booking._id}`, {
        method: "DELETE",
      });
      setBookings((current) =>
        current.filter((item) => item._id !== booking._id),
      );
    } finally {
      setCancellingId(null);
    }
  }

  const email = session?.user?.email;

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-4xl font-medium">My Bookings</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage and view your upcoming travel plans
        </p>
        <div className="mt-8 border border-dashed border-cyan-200">
          {isPending || loading ? (
            <p className="p-6 text-sm text-muted-foreground">
              Loading your bookings...
            </p>
          ) : !email ? (
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Login to view your bookings.
              </p>
              <Link
                href="/sign-in"
                className="mt-3 inline-flex bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-700"
              >
                Login
              </Link>
            </div>
          ) : failed ? (
            <p className="p-6 text-sm text-muted-foreground">
              Couldn't load your bookings. Please try again later.
            </p>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                You have no upcoming trips booked yet.
              </p>
              <Link
                href="/destinations"
                className="mt-3 inline-flex bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-700"
              >
                Browse Destinations
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-dashed divide-cyan-200">
              {bookings.map((booking) => {
                const destination = findBookedDestination(
                  destinations,
                  booking,
                );
                const status = booking.status ?? "Pending";
                const confirmed = status === "Confirmed";
                return (
                  <li
                    key={booking._id}
                    className="flex flex-col gap-4 border border-inherit p-4 sm:flex-row sm:items-center sm:gap-6"
                  >
                    <div className="h-32 w-full shrink-0 overflow-hidden rounded-sm bg-muted sm:h-28 sm:w-52">
                      {destination?.imageUrl ? (
                        // biome-ignore lint/performance/noImgElement: remote user-submitted urls, unfiltered host domains
                        <img
                          src={destination.imageUrl}
                          alt={booking.destinationName ?? "Booking"}
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${confirmed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {confirmed ? (
                          <CircleCheck className="size-3.5" />
                        ) : (
                          <Clock className="size-3.5" />
                        )}
                        {status}
                      </p>
                      <h3 className="mt-2 truncate text-2xl font-medium">
                        {booking.destinationName ?? "Trip"}
                      </h3>
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center gap-1.5">
                          <CalendarDays className="size-3.5" />
                          Departure: {formatDeparture(booking.departureDate)}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="size-3.5" />
                          Booking ID: {booking._id}
                        </p>
                      </div>
                      <p className="mt-2 text-3xl font-semibold text-cyan-600">
                        ${booking.price ?? 0}
                      </p>
                    </div>
                    <div className="flex gap-2 self-start sm:flex-col sm:self-center">
                      <button
                        type="button"
                        disabled={cancellingId === booking._id}
                        onClick={() => handleCancel(booking)}
                        className="flex items-center gap-1.5 border border-red-400 px-4 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                      >
                        <Trash2 className="size-3.5" />
                        {cancellingId === booking._id ? "Cancelling" : "Cancel"}
                      </button>
                      <Link
                        href={
                          destination
                            ? `/destinations/${destination._id}`
                            : "/destinations"
                        }
                        className="flex items-center gap-1.5 bg-cyan-600 px-4 py-1.5 text-sm text-white transition-colors hover:bg-cyan-700"
                      >
                        <Eye className="size-3.5" />
                        View
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
