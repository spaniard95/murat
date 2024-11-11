export type AddExpenseDTO = {
  date: string;
  category: string;
  subcategory: string;
  amount: number;
  notes?: string;
};
