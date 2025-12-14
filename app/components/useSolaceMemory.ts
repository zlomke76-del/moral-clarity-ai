"use client";

import { useEffect, useRef, useState } from "react";
// NOTE: MCA_USER_KEY must NOT be used as a runtime identity.
// It is a build-time constant and will always be truthy.
// import { MCA_USER_KEY } from "@/lib/mca-config";

export function useSolaceMemory() {
  const [memReady, setMemReady] = useState(false);
  const memoryCacheRef = useRef<any[]>([]);

  // IMPORTANT:
  // userKey must be undefined until a real authenticated identity exists.
  // Do NOT default to any name or constant.
  const [userKey, setUserKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    // In the future you can preload memory here.
    // Identity resolution should happen here as well
    // (e.g., from auth/session), not from constants.
    setMemReady(true);
  }, []);

  return {
    userKey,
    memReady,
    memoryCacheRef,
  };
}
