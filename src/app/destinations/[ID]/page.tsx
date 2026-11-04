import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DestinationDetail } from "@/components/destination-detail";
import { getDestinations } from "@/lib/destination-data";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((destination) => ({ ID: destination._id }));
}

async function Detail({ params }: { params: Promise<{ ID: string }> }) {
  const { ID } = await params;
  const token = await getTokenFromServer();
  const res = await fetch(`http://localhost:5000/destinations/${ID}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) notFound();
  const data = await res.json();

  if (!data) notFound();
  return <DestinationDetail data={data} />;
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
