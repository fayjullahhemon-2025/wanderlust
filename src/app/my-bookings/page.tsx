import { MyBookings } from "@/components/my-bookings";
import { getDestinations } from "@/lib/destination-data";

export default async function MyBookingsPage() {
  const destinations = await getDestinations();

  return (
    <main>
      <MyBookings destinations={destinations} />
    </main>
  );
}
