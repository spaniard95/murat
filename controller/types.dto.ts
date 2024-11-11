export type AddExpenseDTO = {
  date: string;
  category: string;
  subcategory: string;
  amount: number;
  notes?: string;
};

export type AddMonthGoalsDTO = {
  category: string;
  goalAmount: number;
  month: number;
  year: number;
  notes?: string;
};
