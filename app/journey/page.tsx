import JourneyPlanner from "@/components/JourneyPlanner";
import { STOPS } from "@/data/journeyStops";

export const metadata = {
  title: "Journey • Moral Clarity AI",
};

export default function Page() {
  return <JourneyPlanner stops={STOPS} />;
}
