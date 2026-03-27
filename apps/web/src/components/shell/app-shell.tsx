import Link from "next/link";
import type { ReactNode } from "react";

export interface ShellNavItem {
  key: string;
  label: string;
  href: string;
}

interface AppShellSection {
  key: string;
  title: string;
  description: string;
}

interface AppShellProps {
  children: ReactNode;
  currentSection: AppShellSection;
}

const shellNavItems: ShellNavItem[] = [
  { key: "overview", label: "Overview", href: "/app" },
  { key: "health", label: "Health", href: "/app#system-health" },
  { key: "web", label: "Landing", href: "/" }
];

export const AppShell = ({ children, currentSection }: AppShellProps) => {
  return (
    <main className="app-shell">
      <div className="app-shell__frame">
        <header className="app-shell__top">
          <span className="app-shell__kicker">Standalone workspace</span>
          <h1 className="app-shell__title">{currentSection.title}</h1>
          <p className="app-shell__description">{currentSection.description}</p>
        </header>

        <section className="app-shell__content">{children}</section>

        <nav className="app-shell__nav" aria-label="App sections">
          {shellNavItems.map((item) => {
            const isActive = item.key === currentSection.key;

            return (
              <Link
                key={item.key}
                className={`app-shell__tab${isActive ? " app-shell__tab--active" : ""}`}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </main>
  );
};
