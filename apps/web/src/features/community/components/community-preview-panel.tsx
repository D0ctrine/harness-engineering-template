"use client";

import { useCommunityPreview } from "../hooks/use-community-preview";

export type ShareScope = "group" | "external";

interface CommunityPreviewPanelProps {
  scope?: ShareScope;
  groupId?: string;
}

export const CommunityPreviewPanel = ({ scope = "group", groupId }: CommunityPreviewPanelProps) => {
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

  const isGroupScope = scope === "group" && Boolean(data.group);
  const scopeLabel = isGroupScope ? "그룹 나눔" : "전체 나눔";
  const scopeTitle = isGroupScope ? data.title : "전체 묵상 나눔";
  const scopeSummary = isGroupScope
    ? data.summary
    : "그룹 밖의 사람들과 공개적으로 나눈 묵상을 둘러봅니다.";
  const scopeBadge = isGroupScope ? data.group.name : "외부 공개";
  const scopeDescription = isGroupScope
    ? data.group.description
    : "그룹 파라미터가 없거나 외부 범위로 열린 나눔 화면입니다.";

  return (
    <section className="surface-card community-panel">
      <div className="community-panel__header">
        <div>
          <p className="reading-section-label">{scopeLabel}</p>
          <h2>{scopeTitle}</h2>
        </div>
        <span className="reading-reference-pill">{scopeBadge}</span>
      </div>

      <p className="community-panel__summary">{scopeSummary}</p>

      <div className="community-panel__meta">
        <span>{scopeDescription}</span>
        {isGroupScope ? (
          <span>
            범위: {groupId ?? data.group.id} / 역할: {data.membership.role === "member" ? "멤버" : "운영자"}
          </span>
        ) : (
          <span>범위: 외부 공개</span>
        )}
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
