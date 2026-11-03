"use client";

import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Destination, DestinationCard } from "./destination-card";

const PRICE_RANGES = [
  { label: "Under $3000", test: (p: number) => p < 3000 },
  { label: "$3000 - $4500", test: (p: number) => p >= 3000 && p <= 4500 },
  { label: "Above $4500", test: (p: number) => p > 4500 },
];

export function ExploreDestinations({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(destinations.map((d) => d.categories))],
    [destinations],
  );

  const filtered = useMemo(() => {
    let list = [...destinations];
    if (category) list = list.filter((d) => d.categories === category);
    if (priceRange) {
      const range = PRICE_RANGES.find((r) => r.label === priceRange);
      if (range) list = list.filter((d) => range.test(d.price));
    }
    if (sortBy === "price-low-high") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high-low") list.sort((a, b) => b.price - a.price);
    if (sortBy === "name-a-z") {
      list.sort((a, b) => a.destinationName.localeCompare(b.destinationName));
    }
    return list;
  }, [destinations, category, priceRange, sortBy]);

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-10">
        <h1 className="text-4xl font-medium sm:text-5xl">
          Explore All Destinations
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Find your perfect travel experience from our curated collection
        </p>

        <div className="mt-8 grid gap-3 rounded-md border border-border p-2 sm:grid-cols-3 sm:divide-x sm:divide-border">
          <div className="px-2">
            <Select<string> value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full border-none bg-transparent px-0 shadow-none data-[size=default]:h-8">
                <span className="text-xs font-semibold tracking-widest uppercase">
                  <SelectValue>Category</SelectValue>
                </span>
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="px-2">
            <Select<string> value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full border-none bg-transparent px-0 shadow-none data-[size=default]:h-8">
                <span className="text-xs font-semibold tracking-widest uppercase">
                  <SelectValue>Price Range</SelectValue>
                </span>
              </SelectTrigger>
              <SelectContent>
                {PRICE_RANGES.map((r) => (
                  <SelectItem key={r.label} value={r.label}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="px-2">
            <Select<string> value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full border-none bg-transparent px-0 shadow-none data-[size=default]:h-8">
                <span className="text-xs font-semibold tracking-widest uppercase">
                  <SelectValue>Sort By</SelectValue>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low-high">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-high-low">
                  Price: High to Low
                </SelectItem>
                <SelectItem value="name-a-z">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <p className="text-xs font-medium text-muted-foreground">
            Showing {filtered.length}{" "}
            {filtered.length === 1 ? "destination" : "destinations"}
          </p>
          <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((destination) => (
              <DestinationCard
                key={destination._id}
                destination={destination}
              />
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="mt-12 text-center text-sm text-muted-foreground">
              No destinations match your filters.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
