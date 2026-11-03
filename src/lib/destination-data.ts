"use cache";

import { cacheTag } from "next/cache";
import type { Destination } from "@/components/destination-card";

export async function getDestinations(): Promise<Destination[]> {
  const res = await fetch("http://localhost:5000/destinations");
  cacheTag("destinations");
  return (await res.json()) as Destination[];
}

export async function getDestination(id: string): Promise<Destination | null> {
  cacheTag("destinations");
  const res = await fetch(`http://localhost:5000/destinations/${id}`);
  if (!res.ok) return null;
  return (await res.json()) as Destination;
}
