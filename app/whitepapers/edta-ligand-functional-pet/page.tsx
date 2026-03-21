import type { Metadata } from "next";
import ConstraintPage from "../_components/ConstraintPage";
import { edtaLigandFunctionalPetData } from "../_data/edta-ligand-functional-pet";

export const metadata: Metadata = edtaLigandFunctionalPetData.metadata;

export default function Page() {
  return <ConstraintPage data={edtaLigandFunctionalPetData} />;
}
