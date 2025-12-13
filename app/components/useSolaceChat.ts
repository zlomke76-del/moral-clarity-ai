"use client";

import { useCallback, useState } from "react";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
};

type UseSolaceChatArgs = {
  ministryOn: boolean;
  modeHint: string;
  userKey: string;
  clearPending: () => void;
};

export function useSolaceChat({
  ministryOn,
  modeHint,
  userKey,
  clearPending,
}: UseSolaceChatArgs) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Ready when you are." },
  ]);
  const [streaming, setStreaming] = useState(false);

  const send = useCallback(
    async (input: string) => {
      if (!input.trim() || streaming) return;

      const userMsg = input.trim();
      setStreaming(true);

      setMessages((m) => [...m, { role: "user", content: userMsg }]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMsg,
            history: messages,
            workspaceId: MCA_WORKSPACE_ID,
            ministryMode: ministryOn,
            modeHint,
            userKey,
          }),
        });

        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || "Request failed");
        }

        const data = await res.json();

        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.text ?? "" },
        ]);
      } catch (err: any) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `⚠️ ${err.message || "Error"}`,
          },
        ]);
      } finally {
        setStreaming(false);
        clearPending();
      }
    },
    [messages, ministryOn, modeHint, userKey, streaming, clearPending]
  );

  return {
    messages,
    setMessages,
    streaming,
    send,
  };
}
