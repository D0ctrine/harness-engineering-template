import { CommunityPreviewPanel, type ShareScope } from "../../../features/community/components/community-preview-panel";

interface SharePageProps {
  searchParams: Promise<{
    scope?: string;
    groupId?: string;
  }>;
}

const resolveShareScope = (scope?: string): ShareScope => {
  return scope === "external" ? "external" : "group";
};

export default async function SharePage({ searchParams }: SharePageProps) {
  const params = await searchParams;

  return (
    <div className="share-workspace">
      <CommunityPreviewPanel scope={resolveShareScope(params.scope)} groupId={params.groupId} />
    </div>
  );
}
