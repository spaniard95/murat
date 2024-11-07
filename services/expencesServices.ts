import { db } from "../database.ts";
import {
  isValidDay,
  isValidMonth,
  isValidYear,
} from "../lib/validators/dateValidators.ts";

import type { Expense } from "./types.ts";

const addService = async (expence: Expense) => {
  const { category, subcategory, amount, date, notes } = expence;

  // Validate the input
  if (!amount || isNaN(amount)) {
    throw new Error("Invalid amount provided");
  }
  if (!date || isNaN(Date.parse(date))) {
    throw new Error("Invalid expense date provided");
  }
  if (!category) {
    throw new Error("Category is required");
  }

  try {
    await db`BEGIN`;

    // Check if the category exists
    let categoryResult = await db`
      SELECT id FROM expenses_categories WHERE name = ${category}
    `;
    if (categoryResult.length === 0) {
      // Insert the new category
      console.log("New category added ", category);
      categoryResult = await db`
        INSERT INTO expenses_categories (name) VALUES (${category})
        RETURNING id
      `;
    }
    const categoryId = categoryResult[0].id;

    // Check if the subcategory exists
    let subcategoryId = null;
    if (subcategory) {
      let subcategoryResult = await db`
        SELECT id FROM expenses_subcategories WHERE name = ${subcategory}
      `;
      if (subcategoryResult.length === 0) {
        // Insert the new subcategory
        console.log("New subcategory added ", subcategory);
        subcategoryResult = await db`
          INSERT INTO expenses_subcategories (name, category_id) VALUES (${subcategory}, ${categoryId})
          RETURNING id
        `;
      }
      subcategoryId = subcategoryResult[0].id;
    }

    // Insert the expense
    await db`
      INSERT INTO expenses (amount, expense_date, notes, category_id, subcategory_id)
      VALUES (${amount}, ${date}, ${
      notes || ""
    }, ${categoryId}, ${subcategoryId})
    `;

    await db`COMMIT`;

    return { message: "Expense added successfully" };
  } catch (error) {
    await db`ROLLBACK`;
    console.error(error);
    throw new Error("Failed to add expense");
  }
};

const getAllService = async () => {
  // if subcategory is connected with category, does it make sense to return the category name?
  // or should remove from thedb the category column and just use the subcategory column?
  // and retrive both the category and subcategory name
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

// const getAllByCategoryService = async (category: string) => {
//   try {
//     return await db`SELECT * FROM books`;
//   } catch (e) {
//     console.log(e);
//   }
// };

// this service requires as input the month, if the year is not specified the current year will be used, day is optional but doesnt work at the moment
// QUESTION: should I also make the month optional and default it the current month?
const getAllByDateService = async (
  month: string,
  year?: string,
  day?: string
) => {
  const currentDate = new Date();
  const currentYear = year ?? currentDate.getFullYear().toString();

  // Validate the inputs
  // TODO: make the validations utility functions
  if (!isValidMonth(month)) {
    throw new Error("Request: getAllExpenses-Invalid month provided");
  }
  if (!isValidYear(currentYear)) {
    throw new Error("Request: getAllExpenses-Invalid year provided");
  }
  if (day && !isValidDay(day)) {
    throw new Error("Request: getAllExpenses-Invalid day provided");
  }

  // TODO: check why the blow line doesnt work when added to the query
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
  // getAllByCategoryService,
  getAllByDateService,
  getAllService,
};
