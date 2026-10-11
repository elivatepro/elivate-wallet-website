import { useEffect, useState } from "react";

export function usePathname(): string {
  // Start empty on both server and client so hydration matches; the real
  // path is set right after mount.
  const [pathname, setPathname] = useState<string>("");

  useEffect(() => {
    const update = () => setPathname(window.location.pathname);
    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  return pathname;
}
