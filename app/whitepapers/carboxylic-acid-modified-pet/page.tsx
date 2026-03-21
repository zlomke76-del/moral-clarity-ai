import type { Metadata } from "next";
import ConstraintPage from "../_components/ConstraintPage";
import { carboxylicAcidModifiedPetData } from "../_data/carboxylic-acid-modified-pet";

export const metadata: Metadata = carboxylicAcidModifiedPetData.metadata;

export default function Page() {
  return <ConstraintPage data={carboxylicAcidModifiedPetData} />;
}
