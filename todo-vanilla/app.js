// 저장소: localStorage에 Todo 목록을 저장할 때 사용하는 key 이름
const STORAGE_KEY = "todo-vanilla-items";





// DOM 접근: <form id="todoForm"> 요소를 찾아 submit 이벤트를 연결할 때 사용
const todoForm = document.querySelector("#todoForm");

// DOM 접근: <input id="todoInput"> 요소를 찾아 사용자가 입력한 값을 읽을 때 사용
const todoInput = document.querySelector("#todoInput");

// DOM 접근: <button id="submitButton"> 요소를 찾아 추가 버튼과 수정 완료 버튼으로 사용
const submitButton = document.querySelector("#submitButton");

// DOM 접근: <button id="cancelEditButton"> 요소를 찾아 수정 취소 버튼으로 사용
const cancelEditButton = document.querySelector("#cancelEditButton");

// DOM 접근: <p id="todoMessage"> 요소를 찾아 사용자에게 안내 메시지를 보여줄 때 사용
const todoMessage = document.querySelector("#todoMessage");

// DOM 접근: <strong id="selectedDateText"> 요소를 찾아 현재 선택된 날짜를 표시할 때 사용
const selectedDateText = document.querySelector("#selectedDateText");

// DOM 접근: <button id="previousDateButton"> 요소를 찾아 하루 전 날짜로 이동할 때 사용
const previousDateButton = document.querySelector("#previousDateButton");

// DOM 접근: <button id="nextDateButton"> 요소를 찾아 하루 뒤 날짜로 이동할 때 사용
const nextDateButton = document.querySelector("#nextDateButton");

// DOM 접근: <button id="previousWeekButton"> 요소를 찾아 이전 주로 이동할 때 사용
const previousWeekButton = document.querySelector("#previousWeekButton");

// DOM 접근: <button id="nextWeekButton"> 요소를 찾아 다음 주로 이동할 때 사용
const nextWeekButton = document.querySelector("#nextWeekButton");

// DOM 접근: <div id="weekDateList"> 요소를 찾아 주간 날짜 버튼을 화면에 그릴 때 사용
const weekDateList = document.querySelector("#weekDateList");

// DOM 접근: <ul id="todoList"> 요소를 찾아 Todo 목록을 화면에 그릴 때 사용
const todoList = document.querySelector("#todoList");

// DOM 접근: <span id="remainingCount"> 요소를 찾아 남은 할 일 개수를 표시할 때 사용
const remainingCount = document.querySelector("#remainingCount");

// DOM 접근: <button id="clearCompletedButton"> 요소를 찾아 완료 항목 삭제 이벤트를 연결
const clearCompletedButton = document.querySelector("#clearCompletedButton");

// DOM 접근: class="filter-button"인 필터 버튼 전체를 찾아 각각 클릭 이벤트를 연결
const filterButtons = document.querySelectorAll(".filter-button");





// 데이터 상태: 현재 선택된 날짜. 기본값은 오늘 날짜
let selectedDateKey = getTodayDateKey();

// 데이터 상태: 현재 Todo 목록. 페이지가 열릴 때 localStorage에서 저장된 값을 불러옴
let todos = loadTodosFromStorage();

// 데이터 상태: 현재 선택된 필터. all, active, completed 중 하나의 값을 가짐
let currentFilter = "all";

// 데이터 상태: 수정 중인 Todo의 id. 수정 중이 아니면 null 값을 가짐
let editingTodoId = null;





// 날짜 함수: 오늘 날짜를 YYYY-MM-DD 형태의 문자열로 만듦
function getTodayDateKey() {
  return formatDateKey(new Date());
}

// 날짜 함수: Date 객체를 브라우저의 로컬 날짜 기준 YYYY-MM-DD 문자열로 바꿈
function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 날짜 함수: YYYY-MM-DD 문자열을 Date 객체로 바꿈
function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
}

// 날짜 함수: 선택된 날짜에서 원하는 일수만큼 이동한 날짜를 반환
function addDaysToDate(dateKey, dayCount) {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + dayCount);

  return formatDateKey(date);
}

// 날짜 함수: 선택된 날짜가 속한 주의 월요일 날짜를 반환
function getMondayOfWeek(dateKey) {
  const date = parseDateKey(dateKey);
  const dayOfWeek = date.getDay();
  const distanceFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  date.setDate(date.getDate() + distanceFromMonday);

  return formatDateKey(date);
}

// 날짜 함수: 화면에 보여줄 날짜 문구를 한국어 형태로 만듦
function formatDateLabel(dateKey) {
  const date = parseDateKey(dateKey);
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return formatter.format(date);
}

// 날짜 함수: 주간 뷰에서 사용할 요일 이름을 만듦
function formatWeekDayName(dateKey) {
  const date = parseDateKey(dateKey);
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    weekday: "short",
  });

  return formatter.format(date);
}

// 날짜 함수: 주간 뷰에서 사용할 날짜 숫자를 만듦
function formatWeekDayNumber(dateKey) {
  return String(parseDateKey(dateKey).getDate());
}





// 저장소 함수: localStorage에 저장된 할 일을 불러오고, 잘못된 데이터면 빈 배열로 시작
function loadTodosFromStorage() {
  const storedTodos = localStorage.getItem(STORAGE_KEY);

  if (!storedTodos) {
    return [];
  }

  try {
    const parsedTodos = JSON.parse(storedTodos);

    if (!Array.isArray(parsedTodos)) {
      return [];
    }

    return parsedTodos.map((todo) => ({
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      date: todo.date || selectedDateKey,
    }));
  } catch {
    return [];
  }
}

// 저장소 함수: 현재 Todo 목록 배열을 문자열로 바꿔 localStorage에 저장
function saveTodosToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}





// 안내 메시지 함수: <p id="todoMessage">에 사용자에게 보여줄 안내 문구를 넣음
function showMessage(messageText) {
  todoMessage.textContent = messageText;
}

// 안내 메시지 함수: 안내 메시지가 필요 없을 때 <p id="todoMessage"> 내용을 비움
function clearMessage() {
  todoMessage.textContent = "";
}





// 데이터 생성 함수: 입력받은 텍스트와 현재 선택 날짜를 Todo 객체 형태로 만듦
function createTodo(text) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    completed: false,
    date: selectedDateKey,
  };
}

// 데이터 찾기 함수: id를 이용해서 수정할 Todo 객체를 찾음
function findTodoById(todoId) {
  return todos.find((todo) => todo.id === todoId);
}

// 데이터 필터 함수: 현재 선택 날짜에 해당하는 Todo만 골라서 반환
function getTodosBySelectedDate() {
  return todos.filter((todo) => todo.date === selectedDateKey);
}

// 데이터 필터 함수: 현재 선택 날짜와 현재 필터 상태에 맞는 Todo 목록만 반환
function getFilteredTodos() {
  const todosByDate = getTodosBySelectedDate();

  if (currentFilter === "active") {
    return todosByDate.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    return todosByDate.filter((todo) => todo.completed);
  }

  return todosByDate;
}

// 데이터 계산 함수: 특정 날짜에 저장된 Todo 개수를 계산
function countTodosByDate(dateKey) {
  return todos.filter((todo) => todo.date === dateKey).length;
}





// DOM 업데이트 함수: 현재 선택된 날짜를 <strong id="selectedDateText">에 표시
function renderSelectedDate() {
  const todayDateKey = getTodayDateKey();
  const dateLabel = formatDateLabel(selectedDateKey);

  selectedDateText.textContent =
    selectedDateKey === todayDateKey ? `${dateLabel} (오늘)` : dateLabel;
}

// DOM 생성 함수: 주간 보기에서 날짜 버튼 하나를 만듦
function renderWeekDateButton(dateKey) {
  const weekDateButton = document.createElement("button");
  const isToday = dateKey === getTodayDateKey();
  const isSelected = dateKey === selectedDateKey;

  weekDateButton.className = "week-date-button";
  weekDateButton.type = "button";
  weekDateButton.classList.toggle("today", isToday);
  weekDateButton.classList.toggle("active", isSelected);
  weekDateButton.addEventListener("click", () => changeSelectedDate(dateKey));

  const weekDayName = document.createElement("span");
  weekDayName.className = "week-day-name";
  weekDayName.textContent = formatWeekDayName(dateKey);

  const weekDayNumber = document.createElement("strong");
  weekDayNumber.className = "week-day-number";
  weekDayNumber.textContent = formatWeekDayNumber(dateKey);

  const weekTodoCount = document.createElement("span");
  weekTodoCount.className = "week-todo-count";
  weekTodoCount.textContent = `${countTodosByDate(dateKey)}개`;

  weekDateButton.append(weekDayName, weekDayNumber, weekTodoCount);
  weekDateList.appendChild(weekDateButton);
}

// DOM 렌더링 함수: 월요일부터 일요일까지의 날짜 버튼을 화면에 다시 그림
function renderWeekDateList() {
  const mondayDateKey = getMondayOfWeek(selectedDateKey);

  weekDateList.innerHTML = "";

  for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
    const dateKey = addDaysToDate(mondayDateKey, dayIndex);
    renderWeekDateButton(dateKey);
  }
}

// DOM 업데이트 함수: 남은 Todo 개수를 계산해서 <span id="remainingCount">에 표시
function updateRemainingCount() {
  const activeTodoCount = getTodosBySelectedDate().filter((todo) => !todo.completed).length;
  remainingCount.textContent = `남은 할 일 ${activeTodoCount}개`;
}

// DOM 생성 함수: 표시할 Todo가 없을 때 <li> 빈 상태 메시지를 만들어 화면에 추가
function renderEmptyState() {
  const emptyItem = document.createElement("li");
  emptyItem.className = "empty-state";
  emptyItem.textContent = "표시할 할 일이 없습니다.";
  todoList.appendChild(emptyItem);
}

// DOM 생성 함수: Todo의 수정 버튼, 완료 버튼, 삭제 버튼을 묶어서 만듦
function renderTodoActions(todo) {
  const todoActions = document.createElement("div");
  todoActions.className = "todo-actions";

  // DOM 생성: Todo 내용을 수정하기 위한 버튼을 만듦
  const editButton = document.createElement("button");
  editButton.className = "edit-button";
  editButton.type = "button";
  editButton.textContent = "수정";
  editButton.addEventListener("click", () => startEditTodo(todo.id));

  // DOM 생성: Todo 완료 상태를 true/false로 바꾸는 버튼을 만듦
  const completeButton = document.createElement("button");
  completeButton.className = "complete-button";
  completeButton.type = "button";
  completeButton.textContent = todo.completed ? "되돌리기" : "완료";
  completeButton.addEventListener("click", () => toggleTodo(todo.id));

  // DOM 생성: Todo를 삭제하는 버튼을 만듦
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "삭제";
  deleteButton.addEventListener("click", () => deleteTodo(todo.id));

  todoActions.append(editButton, completeButton, deleteButton);

  return todoActions;
}

// DOM 생성 함수: Todo 객체 하나를 텍스트와 버튼들이 들어있는 <li> 요소로 만듦
function renderTodoItem(todo) {
  const todoItem = document.createElement("li");
  todoItem.className = `todo-item${todo.completed ? " completed" : ""}`;

  // DOM 생성: Todo 내용을 보여줄 텍스트 요소를 만듦
  const todoText = document.createElement("span");
  todoText.className = "todo-text";
  todoText.textContent = todo.text;

  // DOM 생성: 수정, 완료, 삭제 버튼 묶음을 만듦
  const todoActions = renderTodoActions(todo);

  todoItem.append(todoText, todoActions);
  todoList.appendChild(todoItem);
}

// DOM 렌더링 함수: 선택 날짜, 주간 날짜, Todo 목록을 현재 데이터 기준으로 다시 그림
function renderScreen() {
  renderSelectedDate();
  renderWeekDateList();
  renderTodoList();
}

// DOM 렌더링 함수: <ul id="todoList">를 비우고 현재 Todo 데이터로 목록을 다시 그림
function renderTodoList() {
  const filteredTodos = getFilteredTodos();

  todoList.innerHTML = "";

  if (filteredTodos.length === 0) {
    renderEmptyState();
  } else {
    filteredTodos.forEach(renderTodoItem);
  }

  updateRemainingCount();
}





// DOM 업데이트 함수: Todo를 새로 추가하는 입력 모드로 화면을 바꿈
function setAddMode() {
  editingTodoId = null;
  submitButton.textContent = "추가";
  cancelEditButton.classList.add("hidden");
  todoInput.value = "";
}

// DOM 업데이트 함수: Todo를 수정하는 입력 모드로 화면을 바꿈
function setEditMode(todo) {
  editingTodoId = todo.id;
  todoInput.value = todo.text;
  submitButton.textContent = "수정 완료";
  cancelEditButton.classList.remove("hidden");
  todoInput.focus();
}





// 이벤트 처리 함수: form 제출 시 추가 모드인지 수정 모드인지 확인해서 알맞은 함수를 실행
function handleTodoFormSubmit(event) {
  event.preventDefault();

  const todoText = todoInput.value.trim();

  // 입력 검증: 빈 값이면 Todo를 만들거나 수정하지 않고 안내 메시지를 보여줌
  if (!todoText) {
    showMessage("할 일을 입력해주세요.");
    todoInput.focus();
    return;
  }

  if (editingTodoId) {
    updateTodo(todoText);
  } else {
    addTodo(todoText);
  }
}

// CRUD 함수 Create: 현재 선택 날짜와 입력값으로 새로운 Todo를 생성
function addTodo(todoText) {
  todos = [createTodo(todoText), ...todos];

  setAddMode();
  clearMessage();
  saveTodosToStorage();
  renderScreen();
}

// CRUD 함수 Read: Todo 목록은 renderTodoList 함수에서 화면에 표시

// CRUD 함수 Update 시작: 수정 버튼을 누른 Todo 내용을 입력창으로 가져옴
function startEditTodo(todoId) {
  const todoToEdit = findTodoById(todoId);

  if (!todoToEdit) {
    return;
  }

  setEditMode(todoToEdit);
  showMessage("내용을 수정한 뒤 수정 완료 버튼을 눌러주세요.");
}

// CRUD 함수 Update 완료: 입력창의 새 텍스트로 Todo 내용을 수정
function updateTodo(updatedText) {
  todos = todos.map((todo) =>
    todo.id === editingTodoId ? { ...todo, text: updatedText } : todo
  );

  setAddMode();
  clearMessage();
  saveTodosToStorage();
  renderScreen();
}

// CRUD 함수 Update 취소: 수정 모드를 끝내고 다시 추가 모드로 돌아감
function cancelEditTodo() {
  setAddMode();
  clearMessage();
}

// 데이터 변경 함수: 선택한 Todo의 completed 값을 true/false로 반전
function toggleTodo(todoId) {
  todos = todos.map((todo) =>
    todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
  );

  saveTodosToStorage();
  renderScreen();
}

// CRUD 함수 Delete: 선택한 Todo를 배열에서 제거
function deleteTodo(todoId) {
  todos = todos.filter((todo) => todo.id !== todoId);

  if (todoId === editingTodoId) {
    setAddMode();
  }

  clearMessage();
  saveTodosToStorage();
  renderScreen();
}

// 데이터 변경 함수: 현재 선택 날짜의 completed가 true인 Todo만 제거
function clearCompletedTodos() {
  todos = todos.filter((todo) => !(todo.date === selectedDateKey && todo.completed));

  setAddMode();
  clearMessage();
  saveTodosToStorage();
  renderScreen();
}





// 이벤트 처리 함수: 클릭한 필터 버튼의 data-filter 값으로 현재 필터를 변경
function changeFilter(selectedFilter) {
  currentFilter = selectedFilter;

  // DOM 업데이트: 선택된 필터 버튼에만 active 클래스를 붙임
  filterButtons.forEach((button) => {
    const isActiveButton = button.dataset.filter === currentFilter;
    button.classList.toggle("active", isActiveButton);
  });

  renderTodoList();
}

// 이벤트 처리 함수: 선택 날짜를 바꾸고 해당 날짜의 Todo 목록을 다시 그림
function changeSelectedDate(dateKey) {
  selectedDateKey = dateKey;

  setAddMode();
  clearMessage();
  renderScreen();
}

// 이벤트 처리 함수: 현재 선택 날짜를 기준으로 원하는 일수만큼 이동
function moveSelectedDate(dayCount) {
  const nextDateKey = addDaysToDate(selectedDateKey, dayCount);

  changeSelectedDate(nextDateKey);
}





// 이벤트 연결: <form id="todoForm">이 제출되면 handleTodoFormSubmit 함수가 실행
todoForm.addEventListener("submit", handleTodoFormSubmit);

// 이벤트 연결: <button id="cancelEditButton">을 클릭하면 수정 모드를 취소
cancelEditButton.addEventListener("click", cancelEditTodo);

// 이벤트 연결: <button id="previousDateButton">을 클릭하면 하루 전 날짜로 이동
previousDateButton.addEventListener("click", () => moveSelectedDate(-1));

// 이벤트 연결: <button id="nextDateButton">을 클릭하면 하루 뒤 날짜로 이동
nextDateButton.addEventListener("click", () => moveSelectedDate(1));

// 이벤트 연결: <button id="previousWeekButton">을 클릭하면 이전 주로 이동
previousWeekButton.addEventListener("click", () => moveSelectedDate(-7));

// 이벤트 연결: <button id="nextWeekButton">을 클릭하면 다음 주로 이동
nextWeekButton.addEventListener("click", () => moveSelectedDate(7));

// 이벤트 연결: <button id="clearCompletedButton">을 클릭하면 현재 선택 날짜의 완료된 Todo를 삭제
clearCompletedButton.addEventListener("click", clearCompletedTodos);

// 이벤트 연결: 각 class="filter-button" 버튼을 클릭하면 Todo 목록 필터가 바뀜
filterButtons.forEach((button) => {
  button.addEventListener("click", () => changeFilter(button.dataset.filter));
});





// 초기 실행: 페이지가 열리면 선택 날짜, 주간 날짜, 저장된 Todo 목록을 화면에 먼저 그림
renderScreen();
