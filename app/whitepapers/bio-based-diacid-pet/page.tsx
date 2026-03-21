import type { Metadata } from "next";
import ConstraintPage from "../_components/ConstraintPage";
import { bioBasedDiacidPetData } from "../_data/bio-based-diacid-pet";

export const metadata: Metadata = bioBasedDiacidPetData.metadata;

export default function Page() {
  return <ConstraintPage data={bioBasedDiacidPetData} />;
}
