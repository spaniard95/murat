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
