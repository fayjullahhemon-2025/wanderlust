"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const reviews = [
  {
    quote:
      "The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned, The Resorts Were Stunning, And The Cultural Experiences Were Truly Unforgettable.",
    name: "Michael Chen",
    location: "Singapore",
    image: "/assets/person1.png",
  },
  {
    quote:
      "Swiss Alps Adventure Exceeded All Expectations! The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommended!",
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/assets/person2.png",
  },
  {
    quote:
      "The Kyoto Tour Felt Effortless! Bookings, Transfers, And Guided Visits Were Flawless, And The Team Responded To Every Question Within Minutes.",
    name: "Thomas Keller",
    location: "Berlin, Germany",
    image: "/assets/person1.png",
  },
  {
    quote:
      "Morocco Desert Safari Was Once In A Lifetime! Sunset Over The Dunes Was Stunning, And The Camp Stay Was More Comfortable Than We Expected.",
    name: "Amelia Wright",
    location: "London, UK",
    image: "/assets/person2.png",
  },
];

export function ClientReview() {
  const [start, setStart] = useState(0);

  const shift = (delta: number) => {
    setStart((value) => (value + delta + reviews.length) % reviews.length);
  };

  const visible = [reviews[start], reviews[(start + 1) % reviews.length]];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-medium sm:text-5xl">
              What Travelers Say
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Real experiences from our happy travelers
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => shift(-1)}
              aria-label="Previous reviews"
              className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="size-4.5" />
            </button>
            <button
              type="button"
              onClick={() => shift(1)}
              aria-label="Next reviews"
              className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
            >
              <ArrowRight className="size-4.5" />
            </button>
          </div>
        </div>
        <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2">
          {visible.map(({ quote, name, location, image }) => (
            <article
              key={name}
              className="flex overflow-hidden bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
            >
              <div className="flex min-w-0 flex-1 flex-col p-6">
                <blockquote className="flex-1 text-sm leading-relaxed font-semibold text-foreground">
                  “{quote}”
                </blockquote>
                <footer className="mt-6 border-t border-border/60 pt-4">
                  <p className="text-sm font-medium text-cyan-600">
                    —&nbsp;{name}
                  </p>
                  <p className="text-xs text-muted-foreground">{location}</p>
                </footer>
              </div>
              <div className="relative w-36 shrink-0 sm:w-40">
                <Image
                  src={image}
                  alt={`Portrait of ${name}`}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
