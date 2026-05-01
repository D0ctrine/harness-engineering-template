"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type {
  AuthMeResponse,
  AuthProvider as SsoAuthProvider,
  AuthenticatedUser,
  PendingSignupProfile,
  SignupRequest
} from "@harness/shared";
import { authService } from "../services/auth-service";
import { LoginModal } from "../components/login-modal";
import { OnboardingModal } from "../components/onboarding-modal";

type AuthStatus = "loading" | "anonymous" | "authenticated";

interface AuthState {
  status: AuthStatus;
  user: AuthenticatedUser | null;
  pendingProfile: PendingSignupProfile | null;
  requiresOnboarding: boolean;
}

interface AuthContextValue extends AuthState {
  authError: string | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  getLoginUrl: (provider: SsoAuthProvider) => string;
  refreshAuth: () => Promise<AuthMeResponse | null>;
  completeSignup: (request: SignupRequest) => Promise<boolean>;
}

const initialState: AuthState = {
  status: "loading",
  user: null,
  pendingProfile: null,
  requiresOnboarding: false
};

const AuthContext = createContext<AuthContextValue | null>(null);

const toAuthState = (response: AuthMeResponse): AuthState => ({
  status: response.isAuthenticated ? "authenticated" : "anonymous",
  user: response.user,
  pendingProfile: response.pendingProfile,
  requiresOnboarding: response.requiresOnboarding
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const refreshAuth = useCallback(async () => {
    try {
      setAuthError(null);
      const response = await authService.getMe();
      setState(toAuthState(response));
      return response;
    } catch {
      setAuthError("로그인 상태를 확인하지 못했습니다.");
      setState({
        status: "anonymous",
        user: null,
        pendingProfile: null,
        requiresOnboarding: false
      });
      return null;
    }
  }, []);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  const completeSignup = useCallback(async (request: SignupRequest) => {
    try {
      setAuthError(null);
      const response = await authService.signup(request);
      setState({
        status: "authenticated",
        user: response.user,
        pendingProfile: null,
        requiresOnboarding: false
      });
      return true;
    } catch {
      setAuthError("회원 정보를 저장하지 못했습니다. 입력값을 확인해 주세요.");
      return false;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      authError,
      isLoginModalOpen,
      openLoginModal: () => setIsLoginModalOpen(true),
      closeLoginModal: () => setIsLoginModalOpen(false),
      getLoginUrl: authService.createLoginUrl,
      refreshAuth,
      completeSignup
    }),
    [authError, completeSignup, isLoginModalOpen, refreshAuth, state]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal
        isOpen={isLoginModalOpen && !state.requiresOnboarding}
        errorMessage={authError}
        getLoginUrl={authService.createLoginUrl}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <OnboardingModal
        isOpen={state.requiresOnboarding}
        errorMessage={authError}
        pendingProfile={state.pendingProfile}
        onSubmit={completeSignup}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
