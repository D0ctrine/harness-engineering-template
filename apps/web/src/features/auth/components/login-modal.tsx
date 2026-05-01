"use client";

import type { AuthProvider } from "@harness/shared";

interface LoginModalProps {
  isOpen: boolean;
  errorMessage: string | null;
  getLoginUrl: (provider: AuthProvider) => string;
  onClose: () => void;
}

const providers: Array<{ key: AuthProvider; label: string }> = [
  { key: "google", label: "Google로 계속" },
  { key: "kakao", label: "Kakao로 계속" },
  { key: "naver", label: "Naver로 계속" }
];

export const LoginModal = ({ isOpen, errorMessage, getLoginUrl, onClose }: LoginModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-login-title">
      <div className="auth-modal__backdrop" onClick={onClose} />
      <section className="auth-modal__panel">
        <button className="auth-modal__close" type="button" aria-label="로그인 닫기" onClick={onClose}>
          닫기
        </button>
        <p className="reading-section-label">저장하려면 로그인</p>
        <h2 id="auth-login-title">작성한 묵상은 그대로 보관됩니다</h2>
        <p className="auth-modal__copy">로그인 후 저장하면 오늘의 묵상이 계정에 안전하게 저장됩니다.</p>

        <div className="auth-provider-list">
          {providers.map((provider) => (
            <a key={provider.key} className={`auth-provider auth-provider--${provider.key}`} href={getLoginUrl(provider.key)}>
              {provider.label}
            </a>
          ))}
        </div>

        {errorMessage ? <p className="auth-modal__error">{errorMessage}</p> : null}
      </section>
    </div>
  );
};
