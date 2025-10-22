// app/solace/primitive/SolaceChatPrimitive.tsx
"use client";
import { ReactNode } from "react";
import type { Msg } from "../core/useSolaceChat";

export function SolaceChatPrimitive(props: {
  header?: ReactNode;
  transcript: ReactNode;
  composer: ReactNode;
  className?: string;
}) {
  return (
    <div className={props.className} data-solace-chat>
      {props.header ?? null}
      {props.transcript}
      {props.composer}
    </div>
  );
}

export function DefaultTranscript({ messages }: { messages: Msg[] }) {
  return (
    <div data-slot="transcript">
      {messages.map((m, i) => (
        <div key={i} data-msg={m.role}>{m.content}</div>
      ))}
    </div>
  );
}
