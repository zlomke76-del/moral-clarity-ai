import type { Metadata } from "next";
import ConstraintPage from "../_components/ConstraintPage";
import { cyanateEsterPetData } from "../_data/cyanate-ester-pet";

export const metadata: Metadata = cyanateEsterPetData.metadata;

export default function Page() {
  return <ConstraintPage data={cyanateEsterPetData} />;
}
