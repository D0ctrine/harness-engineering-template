import Link from "next/link";
import { runtimeConfig } from "../../lib/runtime-config";

export const WebHeader = () => {
  return (
    <header className="web-header">
      <div className="page-wrap web-header__inner">
        <Link className="web-header__brand" href="/">
          <span className="web-header__mark">H</span>
          <span>{runtimeConfig.appShortName}</span>
        </Link>

        <nav className="web-header__nav" aria-label="Primary">
          <Link href="#structure">Structure</Link>
          <Link href="#install">Install</Link>
          <Link href="/app">App shell</Link>
        </nav>
      </div>
    </header>
  );
};
