export const isValidDay = (day: string) =>
  isNaN(Number(day)) || Number(day) < 1 || Number(day) > 31;

export const isValidMonth = (month: string) =>
  isNaN(Number(month)) || Number(month) < 1 || Number(month) > 12;

export const isValidYear = (year: string) =>
  isNaN(Number(year)) || Number(year) < 1815 || Number(year) > 3000;
