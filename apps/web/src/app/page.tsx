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

              <aside className="landing-verse-card" aria-label="오늘의 중심 말씀">
                <div className="landing-verse-card__top">
                  <img
                    className="landing-verse-card__mark"
                    src="/icons/juyaro-mark.svg"
                    alt=""
                    aria-hidden="true"
                    width="60"
                    height="60"
                  />
                  <p className="landing-verse-card__label">오늘의 중심 말씀</p>
                </div>
                <h2>여호수아 1:1-8</h2>
                <blockquote>
                  이 율법책을 네 입에서 떠나지 말게 하며 주야로 그것을 묵상하여 그 안에 기록된 대로 다 지켜 행하라 그리하면 네 길이 평탄하게 될 것이며 네가 형통하리라
                </blockquote>
                <p className="landing-verse-card__summary">
                  여호수아 1장 1절부터 8절까지 읽으며, 말씀을 가까이 두고 삶에 적용하는 묵상을 시작합니다.
                </p>
              </aside>
            </div>
          </section>

          <section className="landing-grid" id="experience">
            <article className="surface-card">
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

            <article className="surface-card">
              <h2>묵상과 나눔으로 이어가기</h2>
              <p>
                읽은 말씀은 메모에서 끝나지 않고, 아래 묵상 질문과 공동체 나눔 흐름으로
                자연스럽게 이어집니다.
              </p>
              <ul className="stack-list">
                <li>
                  <strong>메모</strong>
                  <span>본문 옆에서 바로 적으면서 생각을 놓치지 않습니다.</span>
                </li>
                <li>
                  <strong>묵상 질문</strong>
                  <span>읽은 본문을 삶과 연결하는 질문으로 마음을 정리합니다.</span>
                </li>
                <li>
                  <strong>나눔</strong>
                  <span>공동체 공유는 선택적으로, 그룹 안에서 안전하게 이어집니다.</span>
                </li>
              </ul>
            </article>

            <article className="surface-card">
              <h2>설치하고 자주 돌아오기</h2>
              <p>
                모바일과 데스크톱 모두에서 하나의 PWA로 접근하고, 앱처럼 다시 돌아올 수 있게
                구성했습니다.
              </p>
              <ul className="stack-list">
                <li>
                  <strong>Manifest</strong>
                  <span>읽기와 묵상으로 바로 들어가는 바로가기를 제공합니다.</span>
                </li>
                <li>
                  <strong>서비스 워커</strong>
                  <span>오프라인 상황에서도 기본 셸과 안내 화면을 유지합니다.</span>
                </li>
                <li>
                  <strong>설치형 셸</strong>
                  <span>브라우저 UI 방해 없이 짧은 일상 방문에 집중할 수 있습니다.</span>
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
