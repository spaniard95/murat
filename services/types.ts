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

export interface CategoryWithSubcategories {
  category_name: string;
  subcategories: string[];
}
