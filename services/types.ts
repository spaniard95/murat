export interface Expense {
  category: string;
  subcategory: string;
  amount: number;
  date: Date;
  notes?: string;
}

export type AddExpenceOptions = {
  ifCategoryExistsAddNew?: boolean;
  ifSubcategoryExistsAddNew?: boolean;
};
type Subcategory = {
  id: number;
  name: string;
};
export interface CategoryWithSubcategories {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

export interface GET_CategoriesResponse {
  categories: CategoryWithSubcategories[];
}

export interface ExpenseItem {
  expense_id: number;
  amount: number;
  expense_date: string;
  notes: string;
  category_id: number;
  subcategory_id: number;
  category_name: string;
  subcategory_name: string;
}

export interface ExpensesByDateService {
  expenses: ExpenseItem[];
}
