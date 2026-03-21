import type { Metadata } from "next";
import ConstraintPage from "../_components/ConstraintPage";
import { citricAcidModifiedPetData } from "../_data/citric-acid-modified-pet";

export const metadata: Metadata = citricAcidModifiedPetData.metadata;

export default function Page() {
  return <ConstraintPage data={citricAcidModifiedPetData} />;
}
