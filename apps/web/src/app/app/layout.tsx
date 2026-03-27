import type { ReactNode } from "react";
import { AppShell } from "../../components/shell/app-shell";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppShell
      currentSection={{
        key: "overview",
        title: "Installed workspace",
        description:
          "A mobile-friendly shell for dashboards, internal modules, and agent-delivered workflows."
      }}
    >
      {children}
    </AppShell>
  );
}
