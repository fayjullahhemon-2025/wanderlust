import { Banner } from "@/components/banner";
import { BookTrip } from "@/components/book-trip";
import { ClientReview } from "@/components/client-review";
import { Navbar } from "@/components/navbar";
import { WhyChooseUs } from "@/components/why-choose-us";

export default function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <WhyChooseUs />
      <ClientReview />
      <BookTrip />
    </>
  );
}
