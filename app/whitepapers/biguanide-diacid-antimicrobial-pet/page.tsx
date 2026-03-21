import type { Metadata } from "next";
import ConstraintPage from "../_components/ConstraintPage";
import { biguanideDiacidAntimicrobialPetData } from "../_data/biguanide-diacid-antimicrobial-pet";

export const metadata: Metadata = biguanideDiacidAntimicrobialPetData.metadata;

export default function Page() {
  return <ConstraintPage data={biguanideDiacidAntimicrobialPetData} />;
}
