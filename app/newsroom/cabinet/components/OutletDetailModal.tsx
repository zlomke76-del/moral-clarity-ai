// app/newsroom/cabinet/components/OutletDetailModal.tsx
"use client";

import type { OutletDetailData, OutletTrendPoint } from "../types";

type Props = {
  outlet: OutletDetailData | null;
  trends: OutletTrendPoint[] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Legacy stub component.
 *
 * The active outlet detail UI is handled by `OutletDetailDialog`.
 * This modal is kept as a no-op so that any older imports still type-check
 * without breaking the build.
 */
export default function OutletDetailModal(props: Props) {
  const { open, onOpenChange, outlet, trends } = props;

  // Mark as used so lint doesn't complain
  void onOpenChange;
  void trends;

  if (!open || !outlet) return null;

  // Intentionally render nothing; all real UI is in OutletDetailDialog.
  return null;
}

