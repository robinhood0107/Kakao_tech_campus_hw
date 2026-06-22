import axios, { AxiosError } from "axios";
import type { Todo, TodoFilter, TodoInput, TodoUpdateInput } from "./types";

type TodoApiQuery = {
  filter: TodoFilter;
  search: string;
  date?: string;
};

const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:9010";

const backendClient = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchTodos(query: TodoApiQuery) {
  const response = await backendClient.get<Todo[]>("/todos", {
    params: {
      filter: query.filter,
      search: query.search || undefined,
      date: query.date,
    },
  });

  return response.data;
}

export async function fetchTodo(todoId: number) {
  const response = await backendClient.get<Todo>(`/todos/${todoId}`);

  return response.data;
}

export async function createTodo(input: TodoInput) {
  const response = await backendClient.post<Todo>("/todos", input);

  return response.data;
}

export async function updateTodo(todoId: number, input: TodoUpdateInput) {
  const response = await backendClient.put<Todo>(`/todos/${todoId}`, input);

  return response.data;
}

export async function deleteTodo(todoId: number) {
  await backendClient.delete(`/todos/${todoId}`);
}

export function getBackendError(error: unknown) {
  if (error instanceof AxiosError && error.response) {
    return {
      body: error.response.data,
      status: error.response.status,
    };
  }

  return {
    body: { detail: "Backend request failed" },
    status: 502,
  };
}
