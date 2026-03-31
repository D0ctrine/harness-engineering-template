export interface GroupMembership {
  groupId: string;
  userId: string;
  role: "owner" | "member";
}
