import Link from "next/link";
import { runtimeConfig } from "../../lib/runtime-config";

export const WebHeader = () => {
  return (
    <header className="web-header">
      <div className="page-wrap web-header__inner">
        <Link className="web-header__brand" href="/">
          <img
            className="web-header__mark"
            src="/icons/juyaro-mark.svg"
            alt=""
            aria-hidden="true"
            width="44"
            height="44"
          />
          <span>{runtimeConfig.appShortName}</span>
        </Link>

        <nav className="web-header__nav" aria-label="Primary">
          <Link href="#experience">소개</Link>
          <Link href="#install">설치</Link>
          <Link href="/app">오늘의 큐티</Link>
        </nav>
      </div>
    </header>
  );
};
