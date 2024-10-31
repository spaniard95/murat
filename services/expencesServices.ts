import { db } from "../database.ts";
interface Expence {
  category: string;
  subcategory?: string;
  amount: number;
  date: string;
}

const addService = async (expence: Expence) => {
  return new Promise((resolve, reject) => {
    resolve({ message: "Expence added successfully " });
  });
};

const getAllService = async () => {
  try {
    return await db`SELECT e.id AS expense_id,
       e.amount,
       e.expense_date,
       e.notes,
       c.name AS category_name,
       s.name AS subcategory_name
FROM expenses e
JOIN expenses_categories c ON e.category_id = c.id
JOIN expenses_subcategories s ON e.subcategory_id = s.id; `;
  } catch (e) {
    console.log(e);
  }
};

const getAllByCategoryService = async (category: string) => {
  try {
    return await db`SELECT * FROM books`;
  } catch (e) {
    console.log(e);
  }
};

const getAllByDateService = async (
  day: string,
  month: string,
  year: string
) => {
  return new Promise((resolve, reject) => {
    resolve([
      { category: "test", subcategory: "test", amount: 1, date: "test" },
    ]);
  });
};

export {
  addService,
  getAllService,
  getAllByCategoryService,
  getAllByDateService,
};
