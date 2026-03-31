export type Testament = "old" | "new";

export interface Book {
  id: string;
  name: string;
  testament: Testament;
  order: number;
}
