import type { Metadata } from "next";
import ConstraintPage from "../_components/ConstraintPage";
import { catecholBearingPetData } from "../_data/catechol-bearing-pet";

export const metadata: Metadata = catecholBearingPetData.metadata;

export default function Page() {
  return <ConstraintPage data={catecholBearingPetData} />;
}
