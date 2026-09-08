"use client";

import { useSyncExternalStore } from "react";

const COOKIE_NAME = "banner-dismissed";
const BANNER_EVENT = "banner-dismissed";

const checkBannerDismissed = () => {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split("; ")
    .some((row) => row.startsWith(`${COOKIE_NAME}=`));
};

export const useBannerVisibility = (initialVisible = true) => {
  const subscribe = (callback: () => void) => {
    window.addEventListener(BANNER_EVENT, callback);
    return () => {
      window.removeEventListener(BANNER_EVENT, callback);
    };
  };

  const getSnapshot = () => {
    return checkBannerDismissed() ? false : initialVisible;
  };

  const getServerSnapshot = () => {
    return initialVisible;
  };

  const isBannerVisible = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const dismissBanner = () => {
    document.cookie = `${COOKIE_NAME}=true; path=/; max-age=31536000; SameSite=Lax`;
    window.dispatchEvent(new Event(BANNER_EVENT));
  };

  return { isBannerVisible, dismissBanner };
};
