import { PendingFile } from "./types";

type SendArgs = {
  userMsg: string;
  pendingFiles: PendingFile[];
  userKey?: string;
  workspaceId: string;
  conversationId: string;
  ministryOn: boolean;
  modeHint?: string;
};

export async function sendWithVision({
  userMsg,
  pendingFiles,
  userKey,
  workspaceId,
  conversationId,
  ministryOn,
  modeHint,
}: SendArgs) {
  const visionResults: {
    imageUrl: string;
    answer: string;
  }[] = [];

  const imageFiles = pendingFiles.filter((f) =>
    f.mime.startsWith("image/")
  );

  for (const img of imageFiles) {
    const visionRes = await fetch("/api/solace/vision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: img.url,
        prompt: userMsg,
      }),
    });

    const visionData = await visionRes.json();
    if (visionData?.answer) {
      visionResults.push({
        imageUrl: img.url,
        answer: visionData.answer,
      });
    }
  }

  const chatRes = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: userMsg,
      canonicalUserKey: userKey || undefined,
      workspaceId,
      conversationId,
      ministryMode: ministryOn,
      modeHint,
      attachments: pendingFiles,
    }),
  });

  if (!chatRes.ok) {
    throw new Error(`Status ${chatRes.status}`);
  }

  const chatPayload = await chatRes.json();

  return {
    visionResults,
    chatPayload,
  };
}
