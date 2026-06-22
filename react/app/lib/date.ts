const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function getTodayDateKey() {
  return formatDateKey(new Date());
}

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isDateKey(value: string | undefined): value is string {
  return Boolean(value && DATE_KEY_PATTERN.test(value));
}

export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function addDaysToDate(dateKey: string, dayCount: number) {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + dayCount);

  return formatDateKey(date);
}
