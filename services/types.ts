export interface Expense {
  id: number;
  category: string;
  subcategory: string;
  amount: number;
  date: string;
  notes?: string;
}
