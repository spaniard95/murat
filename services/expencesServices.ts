import { db } from "../database.ts";
import type { Expense } from "./types.ts";
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
    return await db`    
      SELECT e.id AS expense_id,
         e.amount,
         e.expense_date,
         e.notes,
         c.name AS category_name,
         s.name AS subcategory_name
      FROM expenses e
      JOIN expenses_categories c ON e.category_id = c.id
      JOIN expenses_subcategories s ON e.subcategory_id = s.id;
   `;
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

// this service requires as input the month, if not specific year the current year will be used, day is optional but doesnt work at the moment
// QUESTION: should I also make the month optional and default it the current month?
const getAllByDateService = async (
  month: string,
  year?: string,
  day?: string
) => {
  const currentDate = new Date();
  const currentYear = year ?? currentDate.getFullYear();

  // Validate the inputs
  // TODO: make the validations utility functions
  if (isNaN(Number(month)) || Number(month) < 1 || Number(month) > 12) {
    throw new Error("Request: getAllExpenses-Invalid month provided");
  }
  if (
    isNaN(Number(currentYear)) ||
    Number(currentYear) < 1815 ||
    Number(currentYear) > 3000
  ) {
    throw new Error("Request: getAllExpenses-Invalid year provided");
  }
  if (day && (isNaN(Number(day)) || Number(day) < 1 || Number(day) > 31)) {
    throw new Error("Request: getAllExpenses-Invalid day provided");
  }

  // TODO: check why this doesnt work
  //  ${day ? db`AND EXTRACT(DAY FROM e.expense_date) = ${day}` : ""}
  try {
    const expenses = (await db`
      SELECT e.id AS expense_id,
             e.amount,
             e.expense_date,
             e.notes,
             c.name AS category_name,
             s.name AS subcategory_name
      FROM expenses e
      JOIN expenses_categories c ON e.category_id = c.id
      JOIN expenses_subcategories s ON e.subcategory_id = s.id
       WHERE EXTRACT(YEAR FROM e.expense_date) = ${currentYear}
        AND EXTRACT(MONTH FROM e.expense_date) = ${month};
    `) as Expense[];

    const totalAmount = expenses.reduce(
      (sum: number, expense: Expense) => sum + expense.amount,
      0
    );
    return { month, year, expenses, totalAmount };
  } catch (e) {
    console.log(e);
    // TODO: log the specific error- ex. invalid month
    throw new Error("Failed to fetch expenses");
  }
};

export {
  addService,
  getAllByCategoryService,
  getAllByDateService,
  getAllService,
};
