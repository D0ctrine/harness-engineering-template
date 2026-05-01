export type AuthProvider = "google" | "kakao" | "naver";

export interface SsoIdentity {
  provider: AuthProvider;
  providerId: string;
  name?: string;
  age?: number;
}

export interface UserAccount {
  id: string;
  provider: AuthProvider;
  providerId: string;
  name: string;
  age: number;
  church: string | null;
  hasNoChurch: boolean;
  createdAt: string;
}

export interface CreateUserAccountInput {
  provider: AuthProvider;
  providerId: string;
  name: string;
  age: number;
  church: string | null;
  hasNoChurch: boolean;
}
