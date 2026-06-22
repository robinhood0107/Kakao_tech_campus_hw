import { NextRequest, NextResponse } from "next/server";

import { deleteTodo, fetchTodo, getBackendError, updateTodo } from "@/app/lib/api";

type RouteContext = {
  params: Promise<{
    todoId: string;
  }>;
};

async function parseTodoId(context: RouteContext) {
  const { todoId } = await context.params;
  const parsedTodoId = Number(todoId);

  return Number.isInteger(parsedTodoId) ? parsedTodoId : null;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const todoId = await parseTodoId(context);

  if (todoId === null) {
    return NextResponse.json({ detail: "Invalid Todo id" }, { status: 400 });
  }

  try {
    return NextResponse.json(await fetchTodo(todoId));
  } catch (error) {
    const backendError = getBackendError(error);
    return NextResponse.json(backendError.body, { status: backendError.status });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const todoId = await parseTodoId(context);

  if (todoId === null) {
    return NextResponse.json({ detail: "Invalid Todo id" }, { status: 400 });
  }

  try {
    return NextResponse.json(await updateTodo(todoId, await request.json()));
  } catch (error) {
    const backendError = getBackendError(error);
    return NextResponse.json(backendError.body, { status: backendError.status });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const todoId = await parseTodoId(context);

  if (todoId === null) {
    return NextResponse.json({ detail: "Invalid Todo id" }, { status: 400 });
  }

  try {
    await deleteTodo(todoId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const backendError = getBackendError(error);
    return NextResponse.json(backendError.body, { status: backendError.status });
  }
}
