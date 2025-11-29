// app/w/[workspaceId]/memory/page.tsx
"use client";

import MemoryPage from "@/app/memory/page";

type Props = {
  params: { workspaceId: string };
};

export default function WorkspaceMemoryPage(_props: Props) {
  // We ignore workspaceId for now – memory is still user-scoped,
  // we’re just showing the existing Memory admin UI inside the
  // workspace chrome (NeuralSidebar + background).
  return (
    <div className="flex-1 h-full overflow-y-auto px-8 py-8">
      <MemoryPage />
    </div>
  );
}


