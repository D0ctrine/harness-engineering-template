import type { ReactNode } from "react";
import { AppShell } from "../../components/shell/app-shell";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppShell
      currentSection={{
        key: "read",
        title: "오늘의 큐티",
        description:
          "오늘의 말씀을 읽고, 메모를 남긴 뒤 묵상과 나눔으로 자연스럽게 이어가세요."
      }}
    >
      {children}
    </AppShell>
  );
}
