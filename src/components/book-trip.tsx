import { cn } from "cn";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function BookTrip() {
  return (
    <section className="relative">
      <Image
        src="/assets/CTA.png"
        alt="Aerial view of a tropical island surrounded by clear water"
        fill
        sizes="100vw"
        className="object-cover object-bottom"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center text-white sm:py-32">
        <h2 className="text-4xl font-medium sm:text-5xl">
          Ready To Start Your Journey?
        </h2>
        <p className="mt-3 text-sm text-white/80 sm:text-base">
          Join thousands of travelers who have discovered the world with us
        </p>
        <Link
          href="/destinations"
          className={cn(
            buttonVariants({
              size: "lg",
              className:
                "mt-8 bg-white px-6 uppercase text-foreground hover:bg-white/90",
            }),
          )}
        >
          Book Your Trip Today
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
