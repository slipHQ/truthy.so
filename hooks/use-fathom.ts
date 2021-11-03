import { load, LoadOptions, trackPageview } from "fathom-client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useFathom(siteId: string, loadOptions: LoadOptions = {}) {
  const router = useRouter();

  useEffect(() => {
    // Initialize Fathom when the app loads
    // Example: yourdomain.com
    //  - Do not include https://
    //  - This must be an exact match of your domain.
    //  - If you're using www. for your domain, make sure you include that here.
    load(siteId, loadOptions);

    function onRouteChangeComplete() {
      trackPageview();
    }
    // Record a pageview when route changes
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, [router.events, siteId, loadOptions]);
}
