"use client";

import { useEffect, useState } from "react";
import { InstallHint } from "./install-hint";
import {
  isIosDevice,
  isStandaloneDisplayMode,
  type InstallPromptEvent,
  type PwaInstallState
} from "../lib/install-state";
import { registerServiceWorker } from "../lib/register-service-worker";

const initialState: PwaInstallState = {
  isInstallable: false,
  isInstalled: false,
  isIos: false,
  deferredPrompt: null
};

export const PwaProvider = () => {
  const [installState, setInstallState] = useState<PwaInstallState>(initialState);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setInstallState({
      isInstallable: false,
      isInstalled: isStandaloneDisplayMode(),
      isIos: isIosDevice(),
      deferredPrompt: null
    });

    void registerServiceWorker({
      onUpdate: () => {
        setHasUpdate(true);
      }
    });

    const handleBeforeInstallPrompt = (event: InstallPromptEvent) => {
      event.preventDefault();
      setInstallState((current) => ({
        ...current,
        isInstallable: true,
        deferredPrompt: event
      }));
    };

    const handleAppInstalled = () => {
      setInstallState((current) => ({
        ...current,
        isInstallable: false,
        isInstalled: true,
        deferredPrompt: null
      }));
      setIsDismissed(true);
    };

    const standaloneMedia = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = () => {
      setInstallState((current) => ({
        ...current,
        isInstalled: isStandaloneDisplayMode()
      }));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    standaloneMedia.addEventListener("change", handleDisplayModeChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      standaloneMedia.removeEventListener("change", handleDisplayModeChange);
    };
  }, []);

  const handleInstall = async () => {
    if (!installState.deferredPrompt) {
      return;
    }

    await installState.deferredPrompt.prompt();
    const choice = await installState.deferredPrompt.userChoice;

    setInstallState((current) => ({
      ...current,
      isInstallable: false,
      isInstalled: choice.outcome === "accepted" ? true : current.isInstalled,
      deferredPrompt: null
    }));

    if (choice.outcome === "accepted") {
      setIsDismissed(true);
    }
  };

  if (isDismissed && !hasUpdate) {
    return null;
  }

  return (
    <InstallHint
      hasUpdate={hasUpdate}
      installState={installState}
      onDismiss={() => {
        setIsDismissed(true);
        setHasUpdate(false);
      }}
      onInstall={handleInstall}
    />
  );
};
