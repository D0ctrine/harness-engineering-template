import type { AuthProvider, CreateUserAccountInput, UserAccount } from "@harness/domain";

export interface UserAccountRepository {
  findUserById: (userId: string) => Promise<UserAccount | null>;
  findUserByProvider: (provider: AuthProvider, providerId: string) => Promise<UserAccount | null>;
  createUser: (input: CreateUserAccountInput) => Promise<UserAccount>;
}
