import os
from datetime import datetime, timezone
from typing import Literal

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy import Boolean, Column, DateTime, Integer, String, create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

load_dotenv(".env.local")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    date = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class TodoCreate(BaseModel):
    text: str = Field(min_length=1)
    date: str = Field(min_length=10, max_length=10)

    @field_validator("text")
    @classmethod
    def strip_text(cls, value: str) -> str:
        next_value = value.strip()

        if not next_value:
            raise ValueError("Todo text cannot be blank")

        return next_value


class TodoUpdate(BaseModel):
    text: str | None = None
    completed: bool | None = None
    date: str | None = Field(default=None, min_length=10, max_length=10)

    @field_validator("text")
    @classmethod
    def strip_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None

        next_value = value.strip()

        if not next_value:
            raise ValueError("Todo text cannot be blank")

        return next_value


class TodoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str
    completed: bool
    date: str
    created_at: datetime
    updated_at: datetime


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def get_todo_or_404(db: Session, todo_id: int) -> Todo:
    todo = db.get(Todo, todo_id)

    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")

    return todo


@app.get("/")
def root():
    return {"message": "Todo API is running"}


@app.get("/todos", response_model=list[TodoRead])
def list_todos(
    filter: Literal["all", "active", "completed"] = "all",
    search: str | None = Query(default=None),
    date: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Todo)

    if date:
        query = query.filter(Todo.date == date)

    if filter == "active":
        query = query.filter(Todo.completed.is_(False))
    elif filter == "completed":
        query = query.filter(Todo.completed.is_(True))

    if search:
        query = query.filter(Todo.text.ilike(f"%{search.strip()}%"))

    return query.order_by(Todo.id.asc()).all()


@app.get("/todos/{todo_id}", response_model=TodoRead)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    return get_todo_or_404(db, todo_id)


@app.post("/todos", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
def create_todo(todo_input: TodoCreate, db: Session = Depends(get_db)):
    todo = Todo(text=todo_input.text, date=todo_input.date)

    db.add(todo)
    db.commit()
    db.refresh(todo)

    return todo


@app.put("/todos/{todo_id}", response_model=TodoRead)
def update_todo(todo_id: int, todo_input: TodoUpdate, db: Session = Depends(get_db)):
    todo = get_todo_or_404(db, todo_id)

    if todo_input.text is not None:
        todo.text = todo_input.text

    if todo_input.completed is not None:
        todo.completed = todo_input.completed

    if todo_input.date is not None:
        todo.date = todo_input.date

    todo.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(todo)

    return todo


@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = get_todo_or_404(db, todo_id)

    db.delete(todo)
    db.commit()

    return None
