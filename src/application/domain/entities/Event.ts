export type ColorTheme = "blue" | "purple" | "pink" | "green" | "orange" | "teal" | "red" | "yellow";

export class Event {
  id!: string;
  name!: string;
  emoji!: string;
  description!: string;
  team_size!: string;
  color_theme!: ColorTheme;
  is_active!: boolean;
  is_featured!: boolean;
  sort_order!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
