export type TodoFilter = "all" | "active" | "completed";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  date: string;
  created_at: string;
  updated_at: string;
};

export type TodoQuery = {
  filter: TodoFilter;
  search: string;
  date: string;
};

export type TodoInput = {
  text: string;
  date: string;
};

export type TodoUpdateInput = {
  text?: string;
  completed?: boolean;
  date?: string;
};
