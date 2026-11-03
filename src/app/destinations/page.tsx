import { ExploreDestinations } from "@/components/explore-destinations";
import { getDestinations } from "@/lib/destination-data";

const DestinationPage = async () => {
  const destinations = await getDestinations();
  return <ExploreDestinations destinations={destinations} />;
};

export default DestinationPage;
