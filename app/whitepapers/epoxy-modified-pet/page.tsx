import type { Metadata } from "next";
import ConstraintPage from "../_components/ConstraintPage";
import { epoxyModifiedPetData } from "../_data/epoxy-modified-pet";

export const metadata: Metadata = epoxyModifiedPetData.metadata;

export default function Page() {
  return <ConstraintPage data={epoxyModifiedPetData} />;
}
