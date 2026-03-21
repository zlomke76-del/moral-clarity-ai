import type { Metadata } from "next";
import ConstraintPage from "../_components/ConstraintPage";
import { allylSulfateGraftedPetData } from "../_data/allyl-sulfate-grafted-pet";

export const metadata: Metadata = allylSulfateGraftedPetData.metadata;

export default function Page() {
  return <ConstraintPage data={allylSulfateGraftedPetData} />;
}
