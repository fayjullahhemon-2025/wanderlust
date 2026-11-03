import { cn } from "cn";
import { ArrowRight } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const playfair = Playfair_Display({ subsets: ["latin"] });

const searchFields = [
  { label: "Location", placeholder: "Address, City or Zip" },
  { label: "Date/Duration", placeholder: "Anytime/3 Days" },
  { label: "Budget", placeholder: "$0-$3000" },
  { label: "People", placeholder: "5-10" },
];

export function Banner() {
  return (
    <section className="relative mt-14 flex h-[calc(100vh-3.5rem)] min-h-[640px] flex-col">
      <div className="absolute inset-0">
        <Image
          src="/assets/Banner.png"
          alt="Aerial view of a coastal town surrounded by forested hills"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 text-center text-white">
        <h1
          className={`${playfair.className} text-5xl leading-tight font-medium sm:text-6xl lg:text-7xl`}
        >
          Discover Your
          <br />
          Next Adventure
        </h1>
        <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/destinations"
            className={cn(
              buttonVariants({
                size: "lg",
                className:
                  "bg-cyan-600 px-6 text-white uppercase hover:bg-cyan-700",
              }),
            )}
          >
            Explore Now
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/destinations"
            className={cn(
              buttonVariants({
                size: "lg",
                className:
                  "bg-white px-6 uppercase text-foreground hover:bg-white/90",
              }),
            )}
          >
            View Destination
          </Link>
        </div>
      </div>
      <div className="relative">
        <div className="flex flex-wrap items-stretch bg-white">
          {searchFields.map(({ label, placeholder }) => (
            <div
              key={label}
              className="flex min-w-[180px] flex-1 flex-col gap-0.5 px-6 py-3.5 border-b border-l border-border/60 first:border-l-0 md:border-b-0"
            >
              <span className="text-sm font-semibold text-foreground">
                {label}
              </span>
              <input
                type="text"
                name={label}
                placeholder={placeholder}
                aria-label={label}
                className="w-full bg-transparent text-xs text-muted-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          ))}
          <Link
            href="/destinations"
            className={cn(
              buttonVariants({
                size: "lg",
                className:
                  "h-auto min-w-[160px] flex-1 self-stretch rounded-none bg-cyan-600 uppercase text-white hover:bg-cyan-700 md:flex-none md:px-16",
              }),
            )}
          >
            Search
          </Link>
        </div>
      </div>
    </section>
  );
}
