import Link from "next/link";
import { WebHeader } from "../components/shell/web-header";

export default function HomePage() {
  return (
    <>
      <WebHeader />
      <main className="landing-page">
        <div className="page-wrap">
          <section className="landing-hero">
            <span className="landing-hero__eyebrow">Single PWA delivery system</span>
            <div className="landing-hero__copy">
              <h1>Build the web product and the app shell from one Next.js surface.</h1>
              <p>
                This starter now separates the browser landing experience from the installable
                workspace shell, while keeping feature code and PWA platform code in predictable
                folders for future internal projects.
              </p>
            </div>
            <div className="landing-hero__actions">
              <Link className="button-primary" href="/app">
                Open app shell
              </Link>
              <a className="button-secondary" href="#structure">
                Review structure
              </a>
            </div>
          </section>

          <section className="landing-grid" id="structure">
            <article className="surface-card">
              <h2>Browser entry</h2>
              <p>
                Use <code>src/app/page.tsx</code> for marketing, onboarding, and documentation that
                works well in a normal browser tab.
              </p>
              <ul className="stack-list">
                <li>
                  <strong>Header</strong>
                  <span>Shared navigation and product framing</span>
                </li>
                <li>
                  <strong>CTA</strong>
                  <span>Send users into the installed workspace at <code>/app</code></span>
                </li>
                <li>
                  <strong>Install flow</strong>
                  <span>PWA install guidance is mounted globally by the provider</span>
                </li>
              </ul>
            </article>

            <article className="surface-card">
              <h2>Feature layer</h2>
              <p>
                Keep business modules inside <code>src/features/*</code> so components, hooks, and
                services stay vertically grouped by capability instead of by file type alone.
              </p>
              <ul className="stack-list">
                <li>
                  <strong>Components</strong>
                  <span>Only render UI and call hooks</span>
                </li>
                <li>
                  <strong>Hooks</strong>
                  <span>Manage loading, error, and derived client state</span>
                </li>
                <li>
                  <strong>Services</strong>
                  <span>Call shared API clients, never inline fetch inside UI</span>
                </li>
              </ul>
            </article>

            <article className="surface-card">
              <h2>PWA platform</h2>
              <p>
                Put install prompts, service worker registration, standalone checks, and other
                browser platform concerns inside <code>src/platform/pwa/*</code>.
              </p>
              <ul className="stack-list">
                <li>
                  <strong>Manifest</strong>
                  <span>Declares install metadata and app shortcuts</span>
                </li>
                <li>
                  <strong>Service worker</strong>
                  <span>Precaches the offline shell and handles navigation fallback</span>
                </li>
                <li>
                  <strong>Provider</strong>
                  <span>Tracks installability and update state across routes</span>
                </li>
              </ul>
            </article>
          </section>

          <footer className="landing-footer" id="install">
            <p>
              Start feature work from <span className="text-link">/app</span> and keep the landing
              page focused on product framing, onboarding, and install guidance.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
