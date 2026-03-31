"use client";

import { useCommunityPreview } from "../hooks/use-community-preview";

export const CommunityPreviewPanel = () => {
  const { data, error, isLoading } = useCommunityPreview();

  if (isLoading) {
    return (
      <section className="loading-card">
        <p>그룹 나눔 미리보기를 불러오는 중입니다.</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="health-card">
        <div className="health-card__state health-card__state--error">나눔 화면 오류</div>
        <h2>{error?.title ?? "그룹 나눔 미리보기를 찾을 수 없어요"}</h2>
        <p>{error?.message ?? "나눔 미리보기를 불러오지 못했습니다."}</p>
      </section>
    );
  }

  return (
    <section className="surface-card community-panel">
      <div className="community-panel__header">
        <div>
          <p className="reading-section-label">나눔</p>
          <h2>{data.title}</h2>
        </div>
        <span className="reading-reference-pill">{data.group.name}</span>
      </div>

      <p className="community-panel__summary">{data.summary}</p>

      <div className="community-panel__meta">
        <span>{data.group.description}</span>
        <span>역할: {data.membership.role === "member" ? "멤버" : "운영자"}</span>
      </div>

      <div className="community-post-list">
        {data.posts.map((post) => (
          <article key={post.id} className="community-post-card">
            <div className="community-post-card__header">
              <div>
                <h3>{post.title}</h3>
                <p>{post.authorName}</p>
              </div>
              <span>{post.createdAt}</span>
            </div>
            <p>{post.body}</p>
            {post.imageHint ? <p className="community-post-card__hint">{post.imageHint}</p> : null}
            <div className="community-comment-list">
              {post.comments.map((comment) => (
                <div key={comment.id} className="community-comment">
                  <strong>{comment.authorName}</strong>
                  <span>{comment.body}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
