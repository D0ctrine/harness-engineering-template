import type { ApiError } from "@harness/shared";

export interface UserFacingError {
  title: string;
  message: string;
}

export const mapApiErrorToUserMessage = (error: unknown): UserFacingError => {
  const typed = error as ApiError;

  if (typed?.status === 404) {
    return { title: "Not found", message: "Requested resource was not found." };
  }

  if (typed?.status && typed.status >= 500) {
    return { title: "Service unavailable", message: "Please try again in a moment." };
  }

  return { title: "Unexpected error", message: "Something went wrong while loading data." };
};
