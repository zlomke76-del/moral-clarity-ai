"use client";

import { useEffect, useRef, useState } from "react";
import { MCA_USER_KEY } from "@/lib/mca-config";

export function useSolaceMemory() {
  const [memReady, setMemReady] = useState(false);
  const memoryCacheRef = useRef<any[]>([]);
  const userKey = MCA_USER_KEY;

  useEffect(() => {
    // In the future you can preload memory here
    setMemReady(true);
  }, []);

  return {
    userKey,
    memReady,
    memoryCacheRef,
  };
}
