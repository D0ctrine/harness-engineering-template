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
  { key: "read", label: "읽기", href: "/app#today-reading" },
  { key: "note", label: "메모", href: "/app#note-workspace" },
  { key: "reflect", label: "묵상", href: "/app#reflection-step" },
  { key: "share", label: "나눔", href: "/app#community-preview" }
];

export const AppShell = ({ children, currentSection }: AppShellProps) => {
  return (
    <main className="app-shell">
      <div className="app-shell__frame">
        <header className="app-shell__top">
          <span className="app-shell__kicker">
            <img
              className="app-shell__kicker-mark"
              src="/icons/juyaro-mark.svg"
              alt=""
              aria-hidden="true"
              width="28"
              height="28"
            />
            <span>Juyaro QT</span>
          </span>
          <h1 className="app-shell__title">{currentSection.title}</h1>
          <p className="app-shell__description">{currentSection.description}</p>
        </header>

        <section className="app-shell__content">{children}</section>

        <nav className="app-shell__nav" aria-label="앱 섹션">
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
