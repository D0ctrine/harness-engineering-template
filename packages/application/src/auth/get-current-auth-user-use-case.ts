import type { SsoIdentity, UserAccount } from "@harness/domain";
import type { UserAccountRepository } from "./user-account-repository";

export interface CurrentAuthUserQuery {
  sessionUserId?: string | null;
  pendingIdentity?: SsoIdentity | null;
}

export interface CurrentAuthUserResult {
  isAuthenticated: boolean;
  requiresOnboarding: boolean;
  user: UserAccount | null;
  pendingIdentity: SsoIdentity | null;
}

export interface GetCurrentAuthUserUseCase {
  execute: (query: CurrentAuthUserQuery) => Promise<CurrentAuthUserResult>;
}

export const createGetCurrentAuthUserUseCase = (
  repository: UserAccountRepository
): GetCurrentAuthUserUseCase => ({
  execute: async (query) => {
    if (query.sessionUserId) {
      const user = await repository.findUserById(query.sessionUserId);

      if (user) {
        return {
          isAuthenticated: true,
          requiresOnboarding: false,
          user,
          pendingIdentity: null
        };
      }
    }

    if (query.pendingIdentity) {
      return {
        isAuthenticated: true,
        requiresOnboarding: true,
        user: null,
        pendingIdentity: query.pendingIdentity
      };
    }

    return {
      isAuthenticated: false,
      requiresOnboarding: false,
      user: null,
      pendingIdentity: null
    };
  }
});
