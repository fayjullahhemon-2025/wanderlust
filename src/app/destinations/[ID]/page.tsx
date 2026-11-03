import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DestinationDetail } from "@/components/destination-detail";
import { getDestination, getDestinations } from "@/lib/destination-data";

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((destination) => ({ ID: destination._id }));
}

async function Detail({ params }: { params: Promise<{ ID: string }> }) {
  const { ID } = await params;
  const destination = await getDestination(ID);

  if (!destination) notFound();
  return <DestinationDetail destination={destination} />;
}

const DestinationDetailPage = ({
  params,
}: {
  params: Promise<{ ID: string }>;
}) => {
  return (
    <Suspense
      fallback={
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-sm text-muted-foreground">
              Loading destination…
            </p>
          </div>
        </section>
      }
    >
      <Detail params={params} />
    </Suspense>
  );
};

export default DestinationDetailPage;
