"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { PendingSignupProfile, SignupRequest } from "@harness/shared";

interface OnboardingModalProps {
  isOpen: boolean;
  errorMessage: string | null;
  pendingProfile: PendingSignupProfile | null;
  onSubmit: (request: SignupRequest) => Promise<boolean>;
}

const churchOptions = ["주야로교회", "새벽빛교회", "은혜샘교회", "기타"];

export const OnboardingModal = ({ isOpen, errorMessage, pendingProfile, onSubmit }: OnboardingModalProps) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [church, setChurch] = useState(churchOptions[0]);
  const [hasNoChurch, setHasNoChurch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(pendingProfile?.name ?? "");
    setAge(pendingProfile?.age ? String(pendingProfile.age) : "");
    setChurch(churchOptions[0]);
    setHasNoChurch(false);
  }, [isOpen, pendingProfile]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const ok = await onSubmit({
      name,
      age: Number(age),
      church: hasNoChurch ? null : church,
      hasNoChurch
    });

    setIsSubmitting(false);

    if (ok) {
      setName("");
      setAge("");
    }
  };

  return (
    <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-onboarding-title">
      <div className="auth-modal__backdrop" />
      <section className="auth-modal__panel">
        <p className="reading-section-label">처음 오셨나요</p>
        <h2 id="auth-onboarding-title">묵상 저장을 위한 정보를 입력해 주세요</h2>
        <form className="auth-form" onSubmit={(event) => void handleSubmit(event)}>
          <label className="auth-field">
            <span>이름</span>
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label className="auth-field">
            <span>나이</span>
            <input
              inputMode="numeric"
              min="1"
              max="120"
              type="number"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              required
            />
          </label>
          <label className="auth-field">
            <span>교회</span>
            <select
              value={church}
              onChange={(event) => setChurch(event.target.value)}
              disabled={hasNoChurch}
              required={!hasNoChurch}
            >
              {churchOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={hasNoChurch}
              onChange={(event) => setHasNoChurch(event.target.checked)}
            />
            <span>현재 참석하는 교회 없음</span>
          </label>

          {errorMessage ? <p className="auth-modal__error">{errorMessage}</p> : null}

          <button className="button-primary auth-form__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "저장 중" : "시작하기"}
          </button>
        </form>
      </section>
    </div>
  );
};
