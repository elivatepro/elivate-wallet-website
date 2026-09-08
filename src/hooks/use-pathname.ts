import { useEffect, useState } from "react";

export function usePathname(): string {
  const [pathname, setPathname] = useState<string>(
    typeof window === "undefined" ? "" : window.location.pathname,
  );

  useEffect(() => {
    const update = () => setPathname(window.location.pathname);
    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  return pathname;
}
