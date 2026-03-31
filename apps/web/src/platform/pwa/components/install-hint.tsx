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
        <h2>앱 화면 업데이트 준비됨</h2>
        <p>최신 화면 자산을 불러오려면 페이지를 새로고침하거나 설치된 앱을 다시 열어 주세요.</p>
        <div className="pwa-banner__actions">
          <button className="button-primary" onClick={() => window.location.reload()} type="button">
            지금 새로고침
          </button>
          <button className="button-secondary" onClick={onDismiss} type="button">
            나중에
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
        <h2>앱 설치하기</h2>
        <p>
          홈 화면에 추가하면 브라우저 없이 <code>/app</code>으로 바로 들어갈 수 있습니다.
        </p>
        <div className="pwa-banner__actions">
          <button className="button-primary" onClick={() => void onInstall()} type="button">
            앱 설치
          </button>
          <button className="button-secondary" onClick={onDismiss} type="button">
            닫기
          </button>
        </div>
      </aside>
    );
  }

  if (installState.isIos) {
    return (
      <aside className="pwa-banner" aria-live="polite">
        <h2>홈 화면에 추가</h2>
        <p>
          Safari에서 공유 메뉴를 연 뒤 <strong>홈 화면에 추가</strong>를 선택하면 앱처럼 실행할
          수 있습니다.
        </p>
        <div className="pwa-banner__actions">
          <button className="button-secondary" onClick={onDismiss} type="button">
            안내 숨기기
          </button>
        </div>
      </aside>
    );
  }

  return null;
};
