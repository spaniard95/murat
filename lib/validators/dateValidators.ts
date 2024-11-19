export const isValidDayNumber = (day: number) =>
  Number(day) >= 1 && Number(day) <= 31;

export const isValidMonthNumber = (month: number) =>
  Number(month) >= 1 && Number(month) <= 12;

export const isValidYearNumber = (year: number) =>
  Number(year) >= 1995 && Number(year) <= 2095;
