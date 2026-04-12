export interface InstallPromptChoice {
  outcome: "accepted" | "dismissed";
  platform: string;
}

export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallPromptChoice>;
}

export interface PwaInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  isIos: boolean;
  isMobile: boolean;
  deferredPrompt: InstallPromptEvent | null;
}

const INSTALLED_STORAGE_KEY = "juyaro-pwa-installed";

export const hasStoredInstalledState = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(INSTALLED_STORAGE_KEY) === "true";
};

export const storeInstalledState = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(INSTALLED_STORAGE_KEY, "true");
};

export const isIosDevice = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
};

export const isStandaloneDisplayMode = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
};

export const isInstalledExperience = () => {
  return isStandaloneDisplayMode() || hasStoredInstalledState();
};

export const isMobileDevice = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return /android|iphone|ipad|ipod|mobile/i.test(window.navigator.userAgent);
};

declare global {
  interface Navigator {
    standalone?: boolean;
  }

  interface WindowEventMap {
    beforeinstallprompt: InstallPromptEvent;
  }
}
