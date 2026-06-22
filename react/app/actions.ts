"use server";

import {
  createTodo,
  deleteTodo,
  fetchTodo,
  fetchTodos,
  updateTodo,
} from "./lib/api";
import type { TodoInput, TodoQuery, TodoUpdateInput } from "./lib/types";

export async function getTodos(query: TodoQuery) {
  return fetchTodos(query);
}

export async function getTodo(todoId: number) {
  return fetchTodo(todoId);
}

export async function createTodoAction(input: TodoInput) {
  return createTodo(input);
}

export async function updateTodoAction(todoId: number, input: TodoUpdateInput) {
  return updateTodo(todoId, input);
}

export async function deleteTodoAction(todoId: number) {
  return deleteTodo(todoId);
}
