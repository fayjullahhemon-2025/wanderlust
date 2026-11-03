"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const destinations = [
  {
    image: "/assets/destinations/image1.png",
    country: "Nepal",
    title: "Bali Paradise",
    price: "$2700",
    duration: "7 Days/6 Nights",
    rating: "4.5",
  },
  {
    image: "/assets/destinations/image2.png",
    country: "Indonesia",
    title: "Bali Paradise",
    price: "$2700",
    duration: "7 Days/6 Nights",
    rating: "4.5",
  },
  {
    image: "/assets/destinations/image3.png",
    country: "Maldives",
    title: "Island Retreat",
    price: "$3200",
    duration: "5 Days/4 Nights",
    rating: "4.4",
  },
  {
    image: "/assets/destinations/image4.png",
    country: "Thailand",
    title: "Bangkok Explorer",
    price: "$2100",
    duration: "6 Days/5 Nights",
    rating: "4.7",
  },
  {
    image: "/assets/destinations/image5.png",
    country: "Japan",
    title: "Kyoto Cultural Tour",
    price: "$3500",
    duration: "8 Days/7 Nights",
    rating: "4.8",
  },
  {
    image: "/assets/destinations/image6.png",
    country: "Switzerland",
    title: "Alpine Adventure",
    price: "$3900",
    duration: "9 Days/8 Nights",
    rating: "4.6",
  },
];

export function FeaturedDestinations() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [
      Autoplay({
        delay: 3000,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
      }),
    ],
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-medium sm:text-5xl">
              Featured Destinations
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Handpicked travel experiences for the adventure seekers
            </p>
          </div>
          <Link
            href="/destinations"
            className="flex items-center gap-2 border border-cyan-600 px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-cyan-600 uppercase transition-colors hover:bg-cyan-600 hover:text-white"
          >
            All Destinations
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-8xl sm:px-6 lg:px-10">
        <div ref={emblaRef} className="overflow-hidden px-4 sm:px-0">
          <div className="flex">
            {destinations.map((destination) => (
              <div
                key={destination.image}
                className="min-w-0 shrink-0 grow-0 basis-[85%] mr-5 sm:basis-[55%] lg:basis-[47%]"
              >
                <article>
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                    <Image
                      src={destination.image}
                      alt={destination.title}
                      fill
                      sizes="(min-width: 1024px) 47vw, (min-width: 640px) 55vw, 85vw"
                      className="object-cover"
                    />
                    <span className="absolute top-3 right-3 flex items-center gap-1 rounded-md border border-border/50 bg-white px-2 py-1 text-xs font-semibold">
                      {destination.rating}
                      <Star className="size-3.5 fill-current" />
                    </span>
                  </div>
                  <p className="mt-3.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {destination.country}
                  </p>
                  <div className="mt-1 flex items-baseline justify-between gap-3">
                    <h3 className="text-xl font-medium text-foreground">
                      {destination.title}
                    </h3>
                    <p className="text-xl font-semibold text-foreground">
                      {destination.price}
                      <span className="text-[10px] font-normal text-muted-foreground">
                        /Person
                      </span>
                    </p>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    {destination.duration}
                  </p>
                  <Link
                    href="/destinations"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 uppercase underline underline-offset-4 transition-colors hover:text-cyan-700"
                  >
                    Book Now
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </article>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex items-center gap-6 px-4 sm:px-0">
          <span className="text-sm text-foreground">
            {selected + 1}/{destinations.length}
          </span>
          <div className="h-px flex-1 bg-border/60" />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous destinations"
              className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="size-4.5" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next destinations"
              className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
            >
              <ArrowRight className="size-4.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
