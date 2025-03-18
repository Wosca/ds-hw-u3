"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export function ScrollToSection({ sectionId }: { sectionId: string }) {
  const searchParams = useSearchParams();
  const prevSearchParamsRef = useRef<string | null>(null);
  
  useEffect(() => {
    const currentSearchParamsString = searchParams.toString();
    if (currentSearchParamsString.length !== 0 && prevSearchParamsRef.current !== currentSearchParamsString) {
      prevSearchParamsRef.current = currentSearchParamsString;
      
      if (prevSearchParamsRef.current !== null) {
        const element = document.getElementById(sectionId);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      }
    }
  }, [searchParams, sectionId]);

  return null;
}
