"use client";

import type { PwaInstallState } from "../lib/install-state";

interface InstallHintProps {
  hasUpdate: boolean;
  installState: PwaInstallState;
  onDismiss: () => void;
  onInstall: () => Promise<void>;
}

export const InstallHint = ({
  hasUpdate,
  installState,
  onDismiss,
  onInstall
}: InstallHintProps) => {
  if (hasUpdate) {
    return (
      <aside className="pwa-banner" aria-live="polite">
        <h2>App shell update ready</h2>
        <p>Refresh the page or reopen the installed app to load the latest shell assets.</p>
        <div className="pwa-banner__actions">
          <button className="button-primary" onClick={() => window.location.reload()} type="button">
            Refresh now
          </button>
          <button className="button-secondary" onClick={onDismiss} type="button">
            Later
          </button>
        </div>
      </aside>
    );
  }

  if (installState.isInstalled) {
    return null;
  }

  if (installState.isInstallable) {
    return (
      <aside className="pwa-banner" aria-live="polite">
        <h2>Install the app shell</h2>
        <p>
          Add this workspace to the home screen so users land directly in <code>/app</code> with a
          standalone shell.
        </p>
        <div className="pwa-banner__actions">
          <button className="button-primary" onClick={() => void onInstall()} type="button">
            Install app
          </button>
          <button className="button-secondary" onClick={onDismiss} type="button">
            Dismiss
          </button>
        </div>
      </aside>
    );
  }

  if (installState.isIos) {
    return (
      <aside className="pwa-banner" aria-live="polite">
        <h2>Add to Home Screen</h2>
        <p>
          In Safari, open the share sheet and choose <strong>Add to Home Screen</strong> to launch
          the workspace in standalone mode.
        </p>
        <div className="pwa-banner__actions">
          <button className="button-secondary" onClick={onDismiss} type="button">
            Hide hint
          </button>
        </div>
      </aside>
    );
  }

  return null;
};
