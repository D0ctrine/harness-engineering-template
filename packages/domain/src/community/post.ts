import type { Comment } from "./comment";

export interface Post {
  id: string;
  authorName: string;
  title: string;
  body: string;
  imageHint?: string;
  createdAt: string;
  comments: Comment[];
}
