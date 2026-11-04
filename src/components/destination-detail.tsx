import { CalendarDays, Check, MapPin, Star, Tag } from "lucide-react";
import Link from "next/link";
import { BookingSummary } from "./booking-summary";
import { DeleteConfirmationDialog } from "./Delete";
import { UpdateTravelPackageDialog } from "./Dialog";
import type { Destination } from "./destination-card";

export function DestinationDetail({
  data,
}: {
  data: Destination;
}) {
  const highlights = (data.description ?? "")
    .split(/[,.;] /)
    .filter((part) => part.trim().length > 0);

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border border-dashed border-cyan-200">
          <div className="flex justify-between p-4">
            <Link
              href="/destinations"
              className="text-sm text-cyan-700 underline underline-offset-4"
            >
              Back to Destinations
            </Link>
            <div className="flex gap-2">
              <UpdateTravelPackageDialog destination={data} />
              <DeleteConfirmationDialog
                destination={data}
              ></DeleteConfirmationDialog>
            </div>
          </div>
          <div className="px-4">
            <div className="relative aspect-[16/7] overflow-hidden border border-dashed border-cyan-200 p-1.5">
              {/* biome-ignore lint/performance/noImgElement: remote user-submitted urls, unfiltered host domains */}
              <img
                src={data.imageUrl}
                alt={data.destinationName}
                loading="lazy"
                className="size-full rounded-sm object-cover"
              />
            </div>
          </div>
          <div className="grid px-4 pb-6 lg:grid-cols-[1fr_320px]">
            <div className="pr-6">
              <p className="mt-5 flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                <Tag className="size-3" />
                {data.categories}
              </p>
              <h1 className="mt-1.5 text-4xl font-medium">
                {data.destinationName}
              </h1>
              <div className="mt-2.5 flex items-center gap-3">
                {data.rating ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-semibold">
                    {data.rating}
                    <Star className="size-3.5 fill-current" />
                    <span className="font-normal text-muted-foreground">
                      (520 reviews)
                    </span>
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {data.duration}
                </span>
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5" />
                {data.country}
              </p>
              <h2 className="mt-6 font-medium text-foreground">Overview</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {data.description}
              </p>
              <h2 className="mt-6 font-medium text-foreground">Highlights</h2>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-green-600" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
            <BookingSummary destination={data} />
          </div>
        </div>
      </div>
    </section>
  );
}
