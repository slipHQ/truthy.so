import { createTSClient } from "@run-wasm/ts";
import { useEffect, useState } from "react";
import { initScriptLoader } from "next/script";

const tsScript =
  "https://unpkg.com/typescript@latest/lib/typescriptServices.js";


export default function useTypescript() {
  const [tsClient, setTsClient] = useState<any>(null);
  const [tsLoading, setTsLoading] = useState(true);

  function initialiseTsClient() {
    const newTsClient = createTSClient(window.ts);
    newTsClient.fetchLibs(["es5", "dom"]).then(() => {
      setTsClient(newTsClient);
      setTsLoading(false);
    });
  }

  useEffect(() => {
    if (typeof window.ts === "undefined") {
      initScriptLoader([
        {
          src: tsScript,
          onLoad: initialiseTsClient,
        },
      ]);
    } else {
      initialiseTsClient();
    }
  }, [])

  return { tsClient, tsLoading }
}
