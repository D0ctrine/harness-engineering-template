import Link from "next/link";
import { WebHeader } from "../components/shell/web-header";

export default function HomePage() {
  return (
    <>
      <WebHeader />
      <main className="landing-page">
        <div className="page-wrap">
          <section className="landing-hero">
            <div className="landing-hero__layout">
              <div className="landing-hero__copy">
                <span className="landing-hero__eyebrow">매일 묵상하는 삶</span>
                <h1>본문을 읽고, 메모를 남기고, 묵상을 나눌 수 있습니다.</h1>
                <p>
                  Juyaro Bible Project는 한국어 QT 흐름에 맞춘 서비스입니다.
                  오늘의 말씀을 펼치고, 노트에 바로 메모를 남기며, 이어서 묵상과
                  공동체 나눔으로 연결할 수 있습니다.
                </p>
                <div className="landing-hero__actions">
                  <Link className="button-primary" href="/app">
                    오늘의 큐티 열기
                  </Link>
                  <a className="button-secondary" href="#experience">
                    흐름 보기
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="landing-highlight-stack" id="experience">
            <article className="surface-card surface-card--verse surface-card--wide">
              <div className="surface-card__verse-layout">
                <img
                  className="surface-card__portrait"
                  src="/illustrations/Joshua.png"
                  alt="여호수아 일러스트"
                  width="420"
                  height="420"
                />
                <div className="surface-card__verse-copy">
                  <h2>여호수아 1:8</h2>
                  <blockquote className="surface-card__verse">
                    이 율법책을 네 입에서 떠나지 말게 하며 주야로 그것을 묵상하여 그 안에
                    기록된 대로 다 지켜 행하라 그리하면 네 길이 평탄하게 될 것이며 네가
                    형통하리라
                  </blockquote>
                </div>
              </div>
            </article>

            <article className="surface-card surface-card--wide">
              <h2>한 화면에서 읽기와 메모</h2>
              <p>
                QT 화면은 왼쪽 말씀과 오른쪽 노트로 바로 열립니다. 읽는 흐름이 끊기지 않도록
                메모를 같은 화면 안에서 이어갑니다.
              </p>
              <ul className="stack-list">
                <li>
                  <strong>오늘의 본문</strong>
                  <span>메인 화면에서 바로 오늘의 말씀을 펼쳐 읽을 수 있습니다.</span>
                </li>
                <li>
                  <strong>옥스포드 노트</strong>
                  <span>오른쪽 노트 영역에서 키보드로 바로 메모를 이어서 남길 수 있습니다.</span>
                </li>
                <li>
                  <strong>집중된 흐름</strong>
                  <span>메인 진입은 설치형 읽기 화면인 <code>/app</code>으로 바로 연결됩니다.</span>
                </li>
              </ul>
            </article>
          </section>

          <footer className="landing-footer" id="install">
            <p>
              앱을 설치해 더 빠르게 돌아오고, 새로운 기능은
              <span className="text-link"> src/features/*</span> 아래에서 기능별로 계속 확장합니다.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
