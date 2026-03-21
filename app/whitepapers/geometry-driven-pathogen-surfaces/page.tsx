import type { Metadata } from "next";
import ConstraintPage from "../_components/ConstraintPage";
import { geometryDrivenPathogenSurfacesData } from "../_data/geometry-driven-pathogen-surfaces";

export const metadata: Metadata = geometryDrivenPathogenSurfacesData.metadata;

export default function Page() {
  return <ConstraintPage data={geometryDrivenPathogenSurfacesData} />;
}
