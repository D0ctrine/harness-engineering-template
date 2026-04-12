import { ReadingNotePanel } from "../../features/notes/components/reading-note-panel";
import { ReadingHomePanel } from "../../features/reading/components/reading-home-panel";

export default function AppHomePage() {
  return (
    <div className="app-dashboard">
      <section className="home-workspace" aria-label="읽기와 메모 작업 영역">
        <div className="home-workspace__pane home-workspace__pane--reading" id="today-reading">
          <ReadingHomePanel />
        </div>

        <div className="home-workspace__pane home-workspace__pane--notes" id="note-workspace">
          <ReadingNotePanel />
        </div>
      </section>
    </div>
  );
}
