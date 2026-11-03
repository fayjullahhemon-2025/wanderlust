import { ArrowUpRight, CalendarDays, MapPin, Star } from "lucide-react";
import Link from "next/link";

export type Destination = {
  _id: string;
  destinationName: string;
  country: string;
  categories: string;
  price: number;
  duration: string;
  departureCode: string;
  imageUrl: string;
  description?: string;
  rating?: number;
};

export function DestinationCard({ destination }: { destination: Destination }) {
  const { _id } = destination;
  return (
    <article>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        {/* biome-ignore lint/performance/noImgElement: remote user-submitted urls, unfiltered host domains */}
        <img
          src={destination.imageUrl}
          alt={destination.destinationName}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {destination.rating ? (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-md border border-border/50 bg-white px-2 py-1 text-xs font-semibold">
            {destination.rating}
            <Star className="size-3.5 fill-current" />
          </span>
        ) : null}
      </div>
      <p className="mt-3.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="size-3.5" />
        {destination.country}
      </p>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <h3 className="text-xl font-medium text-foreground">
          {destination.destinationName}
        </h3>
        <p className="text-xl font-semibold text-foreground">
          ${destination.price}
        </p>
      </div>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="size-3.5" />
        {destination.duration}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {destination.categories}
      </p>
      <Link
        href={`/destinations/${_id}`}
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 uppercase underline underline-offset-4 transition-colors hover:text-cyan-700"
      >
        Book Now
        <ArrowUpRight className="size-3.5" />
      </Link>
    </article>
  );
}
