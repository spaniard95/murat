export const isValidDay = (day: string) =>
  !(Number(day) >= 1 && Number(day) <= 31);

export const isValidMonth = (month: string) =>
  !(Number(month) >= 1 && Number(month) <= 12);

export const isValidYear = (year: string) =>
  !(Number(year) >= 1900 && Number(year) <= 2100);
