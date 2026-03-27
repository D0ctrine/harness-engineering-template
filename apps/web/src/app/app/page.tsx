import { HealthPanel } from "../../features/health/components/health-panel";

export default function AppHomePage() {
  return (
    <div className="app-dashboard">
      <section className="surface-card">
        <h2>App shell starter</h2>
        <p>
          Put app-first navigation, workspace tools, and internal modules here. The browser landing
          page stays focused on discovery, while this route is the install target declared in the
          manifest.
        </p>
      </section>

      <section className="surface-card" id="module-pattern">
        <h2>Module pattern</h2>
        <p>
          Start each module under <code>src/features/&lt;module&gt;</code> with
          component-hook-service boundaries so API access stays testable and predictable.
        </p>
      </section>

      <div id="system-health">
        <HealthPanel />
      </div>

      <section className="empty-state">
        <h3>Next vertical slice</h3>
        <p>
          Add new cards and routes from here as separate tasks, and keep browser APIs isolated in
          <code> src/platform/pwa</code>.
        </p>
      </section>
    </div>
  );
}
