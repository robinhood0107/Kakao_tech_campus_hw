import importlib
import os
import sys

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def client(tmp_path, monkeypatch):
    database_url = f"sqlite:///{tmp_path / 'todos.db'}"
    monkeypatch.setenv("DATABASE_URL", database_url)

    if "main" in sys.modules:
        module = importlib.reload(sys.modules["main"])
    else:
        module = importlib.import_module("main")

    with TestClient(module.app) as test_client:
        yield test_client

    os.environ.pop("DATABASE_URL", None)


def create_todo(client, text, date="2026-06-22"):
    response = client.post("/todos", json={"text": text, "date": date})
    assert response.status_code == 201
    return response.json()


def test_root_returns_health_message(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "Todo API is running"}


def test_create_list_update_and_delete_todo(client):
    created = create_todo(client, "Next.js App Router 공부")

    assert created["id"] == 1
    assert created["text"] == "Next.js App Router 공부"
    assert created["completed"] is False
    assert created["date"] == "2026-06-22"
    assert created["created_at"]
    assert created["updated_at"]

    list_response = client.get("/todos")
    assert list_response.status_code == 200
    assert [todo["text"] for todo in list_response.json()] == ["Next.js App Router 공부"]

    update_response = client.put(
        "/todos/1",
        json={"text": "Server Component와 Client Component 정리", "completed": True},
    )

    assert update_response.status_code == 200
    updated = update_response.json()
    assert updated["text"] == "Server Component와 Client Component 정리"
    assert updated["completed"] is True

    detail_response = client.get("/todos/1")
    assert detail_response.status_code == 200
    assert detail_response.json()["text"] == "Server Component와 Client Component 정리"

    delete_response = client.delete("/todos/1")
    assert delete_response.status_code == 204
    assert client.get("/todos").json() == []


def test_rejects_blank_text(client):
    response = client.post("/todos", json={"text": "   ", "date": "2026-06-22"})

    assert response.status_code == 422
    assert "Todo text cannot be blank" in response.text


def test_returns_404_for_missing_todo(client):
    assert client.get("/todos/999").status_code == 404
    assert client.put("/todos/999", json={"text": "없음"}).status_code == 404
    assert client.delete("/todos/999").status_code == 404


def test_filters_searches_and_limits_by_date_on_server(client):
    create_todo(client, "Next.js 라우트 핸들러 정리", "2026-06-22")
    completed = create_todo(client, "FastAPI 검색 API 정리", "2026-06-22")
    create_todo(client, "다른 날짜 Todo", "2026-06-23")

    client.put(f"/todos/{completed['id']}", json={"completed": True})

    active_response = client.get("/todos", params={"filter": "active", "date": "2026-06-22"})
    assert [todo["text"] for todo in active_response.json()] == ["Next.js 라우트 핸들러 정리"]

    completed_response = client.get(
        "/todos",
        params={"filter": "completed", "search": "FastAPI", "date": "2026-06-22"},
    )
    assert [todo["text"] for todo in completed_response.json()] == ["FastAPI 검색 API 정리"]

    date_response = client.get("/todos", params={"date": "2026-06-23"})
    assert [todo["text"] for todo in date_response.json()] == ["다른 날짜 Todo"]


def test_rejects_unknown_filter(client):
    response = client.get("/todos", params={"filter": "done"})

    assert response.status_code == 422
