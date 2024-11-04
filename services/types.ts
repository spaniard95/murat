export interface Expense {
  id?: number; // TODO: in the response i have the id but on the request i dont need it
  category: string;
  subcategory: string;
  amount: number;
  date: string;
  notes?: string;
}
