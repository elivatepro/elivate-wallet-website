import { useSyncExternalStore } from "react";

export const LOADER_DONE_EVENT = "elivate:loader-done";

declare global {
  interface Window {
    __elivateLoaderDone?: boolean;
  }
}

export const markLoaderDone = () => {
  if (typeof window === "undefined") return;
  if (window.__elivateLoaderDone) return;
  window.__elivateLoaderDone = true;
  window.dispatchEvent(new CustomEvent(LOADER_DONE_EVENT));
};

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(LOADER_DONE_EVENT, callback);
  return () => window.removeEventListener(LOADER_DONE_EVENT, callback);
};

const getSnapshot = () => {
  if (typeof window === "undefined") return false;
  return !!window.__elivateLoaderDone;
};

const getServerSnapshot = () => false;

export const useLoaderReady = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
