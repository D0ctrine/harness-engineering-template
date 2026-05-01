import type { ApiError } from "@harness/shared";

export interface UserFacingError {
  title: string;
  message: string;
}

export const mapApiErrorToUserMessage = (error: unknown): UserFacingError => {
  const typed = error as ApiError;

  if (typed?.status === 404) {
    return { title: "항목을 찾을 수 없어요", message: "요청한 내용을 찾지 못했습니다." };
  }

  if (typed?.status === 401) {
    return { title: "로그인이 필요해요", message: "다시 로그인한 뒤 저장해 주세요." };
  }

  if (typed?.status === 400) {
    return { title: "입력값을 확인해 주세요", message: "저장할 묵상 내용을 다시 확인해 주세요." };
  }

  if (typed?.status && typed.status >= 500) {
    return { title: "서비스를 불러오지 못했어요", message: "잠시 후 다시 시도해 주세요." };
  }

  return { title: "예상하지 못한 오류", message: "데이터를 불러오는 중 문제가 발생했습니다." };
};
