import type { SsoIdentity, UserAccount } from "@harness/domain";
import { AuthValidationError } from "./auth-errors";
import type { UserAccountRepository } from "./user-account-repository";

export interface SignupProfile {
  name: string;
  age: number;
  church: string | null;
  hasNoChurch: boolean;
}

export interface CompleteSignupCommand {
  identity: SsoIdentity;
  profile: SignupProfile;
}

export interface CompleteSignupUseCase {
  execute: (command: CompleteSignupCommand) => Promise<UserAccount>;
}

const normalizeName = (value: string) => value.trim();
const normalizeChurch = (value: string | null, hasNoChurch: boolean) => {
  const church = value?.trim() ?? "";
  return hasNoChurch ? null : church;
};

export const createCompleteSignupUseCase = (
  repository: UserAccountRepository
): CompleteSignupUseCase => ({
  execute: async ({ identity, profile }) => {
    const name = normalizeName(profile.name);
    const church = normalizeChurch(profile.church, profile.hasNoChurch);

    if (!name) {
      throw new AuthValidationError("이름을 입력해 주세요.");
    }

    if (!Number.isInteger(profile.age) || profile.age < 1 || profile.age > 120) {
      throw new AuthValidationError("나이를 올바르게 입력해 주세요.");
    }

    if (!profile.hasNoChurch && !church) {
      throw new AuthValidationError("교회를 선택하거나 참석하는 교회 없음에 체크해 주세요.");
    }

    const existingUser = await repository.findUserByProvider(identity.provider, identity.providerId);

    if (existingUser) {
      return existingUser;
    }

    return repository.createUser({
      provider: identity.provider,
      providerId: identity.providerId,
      name,
      age: profile.age,
      church,
      hasNoChurch: profile.hasNoChurch
    });
  }
});
