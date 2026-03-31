import type { Group } from "./group";
import type { GroupMembership } from "./group-membership";
import type { Post } from "./post";

export interface CommunityPreview {
  title: string;
  summary: string;
  group: Group;
  membership: GroupMembership;
  posts: Post[];
}
