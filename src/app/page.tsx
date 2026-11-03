import { Banner } from "@/components/banner";
import { BookTrip } from "@/components/book-trip";
import { ClientReview } from "@/components/client-review";
import { FeaturedDestinations } from "@/components/featured-destinations";
import { Navbar } from "@/components/navbar";
import { WhyChooseUs } from "@/components/why-choose-us";

export default function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <FeaturedDestinations />
      <WhyChooseUs />
      <ClientReview />
      <BookTrip />
    </>
  );
}
