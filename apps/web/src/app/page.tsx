import { HealthPanel } from "../components/health-panel";

export default function HomePage() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Harness Engineering Template</h1>
      <p>Enterprise-ready starter optimized for agent execution.</p>
      <HealthPanel />
    </main>
  );
}
