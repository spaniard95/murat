export const isValidMoneyAmount = (amount: number): boolean =>
  typeof amount === "number" && amount > 0;
