import type { Metadata } from "next";
import { AddDestinationForm } from "@/components/add-destination-form";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Add New Travel Package",
};

export default function AddDestinationPage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] pt-14">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Add New Travel Package
        </h1>
        <div className="mt-8">
          <AddDestinationForm />
        </div>
      </div>
    </main>
  );
}
