import type { AuthProvider, Meditation, UserAccount } from "@harness/domain";

export type { AuthProvider };

export interface AuthenticatedUser {
  id: string;
  provider: AuthProvider;
  name: string;
  age: number;
  church: string | null;
  hasNoChurch: boolean;
  createdAt: string;
}

export interface PendingSignupProfile {
  provider: AuthProvider;
  name?: string;
  age?: number;
}

export interface AuthMeResponse {
  isAuthenticated: boolean;
  requiresOnboarding: boolean;
  user: AuthenticatedUser | null;
  pendingProfile: PendingSignupProfile | null;
}

export interface SignupRequest {
  name: string;
  age: number;
  church: string | null;
  hasNoChurch: boolean;
}

export interface SignupResponse {
  user: AuthenticatedUser;
}

export interface MeditationSaveRequest {
  content: string;
  date: string;
}

export interface MeditationSaveResponse {
  meditation: Meditation;
}

export const toAuthenticatedUser = (user: UserAccount): AuthenticatedUser => ({
  id: user.id,
  provider: user.provider,
  name: user.name,
  age: user.age,
  church: user.church,
  hasNoChurch: user.hasNoChurch,
  createdAt: user.createdAt
});
