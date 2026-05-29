"use client";

import { useEffect, useState } from "react";

// Global presenter-mode signal driven by `document.body.dataset.presenter`.
// PresenterOverlay writes the flag when toggled (P key); any component can
// observe it without prop-drilling.

export function setPresenterMode(on: boolean) {
  if (typeof document === "undefined") return;
  document.body.dataset.presenter = on ? "on" : "off";
}

export function usePresenterMode(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const read = () => setOn(document.body.dataset.presenter === "on");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-presenter"],
    });
    return () => obs.disconnect();
  }, []);
  return on;
}
