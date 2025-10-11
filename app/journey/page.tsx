import JourneyPlanner from "@/components/JourneyPlanner";

// Example data — plug in your Webflow/CDN image URLs.
// Include your Arthur’s Pass personal note on that stop.
const STOPS = [
  {
    id: "1",
    title: "West Coast",
    location: "South Island, NZ",
    date: "Day 1",
    imageUrl:
      "https://your-cdn-or-webflow-url/west_coast.jpg",
    caption: "Rocky coastline, waves, moody light.",
    travel: "plane" as const,
  },
  {
    id: "2",
    title: "Arthur’s Pass",
    location: "Southern Alps, NZ",
    date: "Day 2",
    imageUrl:
      "https://your-cdn-or-webflow-url/arthurs_pass.jpg",
    caption: "Mountains, canyon, alpine vibe.",
    promptNote:
      "Tell me about this piece of New Zealand craftsmanship.",
    travel: "car" as const,
  },
  // Add as many as you like…
];

export const metadata = {
  title: "Journey Planner",
};

export default function Page() {
  return <JourneyPlanner stops={STOPS} />;
}
