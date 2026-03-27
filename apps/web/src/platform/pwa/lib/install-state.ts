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
  deferredPrompt: InstallPromptEvent | null;
}

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

declare global {
  interface Navigator {
    standalone?: boolean;
  }

  interface WindowEventMap {
    beforeinstallprompt: InstallPromptEvent;
  }
}
