import type { ReactNode } from "react";

interface AppShellSection {
  key: string;
  title: string;
  description: string;
}

interface AppShellProps {
  children: ReactNode;
  currentSection: AppShellSection;
}

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
      </div>
    </main>
  );
};
