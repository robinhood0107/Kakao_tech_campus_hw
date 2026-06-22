import { NextRequest, NextResponse } from "next/server";

import { createTodo, fetchTodos, getBackendError } from "@/app/lib/api";
import { normalizeFilter, normalizeSearch } from "@/app/lib/query";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  try {
    const todos = await fetchTodos({
      filter: normalizeFilter(params.get("filter") ?? undefined),
      search: normalizeSearch(params.get("search") ?? undefined),
      date: params.get("date") ?? undefined,
    });

    return NextResponse.json(todos);
  } catch (error) {
    const backendError = getBackendError(error);
    return NextResponse.json(backendError.body, { status: backendError.status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const todo = await createTodo(await request.json());

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    const backendError = getBackendError(error);
    return NextResponse.json(backendError.body, { status: backendError.status });
  }
}
