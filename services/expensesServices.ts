import { db } from "../database.ts";
import { isValidMoneyAmount } from "../lib/validators/commonValidators.ts";
import {
  isValidDayNumber,
  isValidMonthNumber,
  isValidYearNumber,
} from "../lib/validators/dateValidators.ts";
import {
  CategoryGoalAlreadyExistsError,
  CategoryNotFoundError,
  SubcategoryNotFoundError,
} from "./errors.ts";

import type {
  Expense,
  AddExpenceOptions,
  CategoryWithSubcategories,
} from "./types.ts";

// get all categories with their subcategories, and group all the subcategories under the category
// ex. [{category_name: "Food", subcategories: ["Groceries", "Restaurants"]}]
const getAllCategoriesWithSubcategories = async (): Promise<
  CategoryWithSubcategories[]
> => {
  try {
    // @ts-ignore
    const data: { category_name: string; subcategory_name: string }[] =
      await db`
      SELECT c.name AS category_name, s.name AS subcategory_name
      FROM expenses_categories c
      JOIN expenses_subcategories s ON c.id = s.category_id;
    `;

    const categoryMap: { [key: string]: string[] } = {};

    data.forEach(
      (item: { category_name: string; subcategory_name: string }) => {
        const category = item.category_name;
        if (!categoryMap[category]) {
          categoryMap[category] = [];
        }
        categoryMap[category].push(item.subcategory_name);
      }
    );

    return Object.keys(categoryMap).map((category) => ({
      category_name: category,
      subcategories: categoryMap[category],
    }));
  } catch (e) {
    console.log(e);
    throw new Error("Failed to fetch categories with subcategories");
  }
};

const addExpenseService = async (
  expense: Expense,
  options: AddExpenceOptions = {
    ifCategoryExistsAddNew: false, // by default do not add a new category
    ifSubcategoryExistsAddNew: false, // by default do not add a new subcategory
  }
) => {
  const { category, subcategory, amount, date, notes } = expense;

  // Validate the input
  if (!amount || !isValidMoneyAmount(amount)) {
    throw new Error("Invalid amount provided");
  }

  if (!date) {
    throw new Error("Invalid expense date provided");
  }
  if (!category) {
    throw new Error("Category is required");
  }

  try {
    await db`BEGIN`;

    // Check if the category exists
    const categoryResult = await db`
     SELECT id FROM expenses_categories WHERE name = ${category}
   `;
    if (categoryResult.length === 0) {
      throw new CategoryNotFoundError("Category does not exist");
    }
    const categoryId = categoryResult[0].id;

    // Check if the subcategory exists
    let subcategoryId = null;
    if (subcategory) {
      let subcategoryResult = await db`
        SELECT id FROM expenses_subcategories WHERE name = ${subcategory}
      `;
      if (subcategoryResult.length === 0) {
        if (!options?.ifSubcategoryExistsAddNew) {
          throw new SubcategoryNotFoundError("Subcategory does not exist");
        }
        // Insert the new subcategory
        subcategoryResult = await db`
          INSERT INTO expenses_subcategories (name, category_id) VALUES (${subcategory}, ${categoryId})
          RETURNING id
        `;
        console.log("New subcategory added ", subcategory);
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
    if (
      error instanceof CategoryNotFoundError ||
      error instanceof SubcategoryNotFoundError
    ) {
      throw error; // Re-throw specific errors to be handled by the controller
    }
  }
};

const getAllExpensesService = async () => {
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

// this service requires as input the month, if the year is not specified the current year will be used, day is optional but is disabled for now
// QUESTION: should I also make the month optional and default it the current month?
const getAllExpensesByDateService = async (
  month: number,
  year?: number,
  day?: number
) => {
  const currentDate = new Date();
  const currentYear = year ?? currentDate.getFullYear();

  // Validate the inputs
  if (!isValidMonthNumber(month)) {
    throw new Error("Request: getAllExpenses-Invalid month provided");
  }
  if (!isValidYearNumber(currentYear)) {
    throw new Error("Request: getAllExpenses-Invalid year provided");
  }
  if (day && !isValidDayNumber(day)) {
    throw new Error("Request: getAllExpenses-Invalid day provided");
  }

  //  TODO: check why the blow line doesnt work when added to the query
  //  ${day ? db`AND EXTRACT(DAY FROM e.expense_date) = ${day}` : ""}
  try {
    const expenses = await db`
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
    `;

    return { expenses };
  } catch (e) {
    console.log(e);
    // TODO: log the specific error- ex. invalid month
    throw new Error("Failed to fetch expenses");
  }
};

// add a new category
const addCategoryService = async (category: string) => {
  try {
    await db`
      INSERT INTO expenses_categories (name) VALUES (${category})
    `;
    return { message: "Category added successfully" };
  } catch (e) {
    console.log(e);
    throw new Error("Failed to add category");
  }
};

// add a new subcategory connected to a category
const addSubcategoryService = async (category: string, subcategory: string) => {
  if (!category) {
    throw new Error("Category is required");
  }
  if (!subcategory) {
    throw new Error("Subcategory is required");
  }

  if (category !== "string" || subcategory !== "string") {
    throw new Error("Invalid input");
  }

  try {
    // Check if the category exists
    const categoryResult = await db`
     SELECT id FROM expenses_categories WHERE name = ${category}
   `;
    if (categoryResult.length === 0) {
      throw new CategoryNotFoundError("Category does not exist");
    }
    const categoryId = categoryResult[0].id;

    // Check if the subcategory exists
    let subcategoryResult = await db`
        SELECT id FROM expenses_subcategories WHERE name = ${subcategory}
      `;
    if (subcategoryResult.length === 0) {
      // Insert the new subcategory
      subcategoryResult = await db`
          INSERT INTO expenses_subcategories (name, category_id) VALUES (${subcategory}, ${categoryId})
          RETURNING id
        `;
      console.log("New subcategory added ", subcategory);
    }

    return { message: "Subcategory added successfully" };
  } catch (e) {
    console.log(e);
    throw new Error("Failed to add subcategory");
  }
};

// add category expenses goal for a specific month
const addMonthGoalsService = async (
  month: number,
  year: number,
  category: string,
  goalAmount: number,
  notes?: string
) => {
  // Validate the input in the future
  if (!category) {
    throw new Error("Missing required fields");
  }
  if (!month || !isValidMonthNumber(month)) {
    throw new Error("Invalid month provided");
  }

  if (!year || !isValidYearNumber(year)) {
    throw new Error("Invalid year provided");
  }

  if (!goalAmount || !isValidMoneyAmount(goalAmount)) {
    throw new Error("Invalid goal amount provided");
  }

  try {
    // Check if the category exists
    const categoryResult = await db`
     SELECT id FROM expenses_categories WHERE name = ${category}
   `;
    if (categoryResult.length === 0) {
      throw new CategoryNotFoundError("Category does not exist");
    }

    // check if the goalAmount already exists
    const goalResult = await db`
    SELECT id FROM expenses_month_goals WHERE month = ${month} AND year = ${year} AND category_id = ${categoryResult[0].id}
  `;
    if (goalResult.length > 0) {
      throw new CategoryGoalAlreadyExistsError(
        `Goal for category ${category} already exists for the month ${month} and year ${year}`
      );
    }

    // Insert the goalAmount
    await db`
    INSERT INTO expenses_month_goals (month, year, category_id, goalAmount, notes)
    VALUES (${month}, ${year}, ${categoryResult[0].id}, ${goalAmount}, ${notes})
  `;

    return { message: "Goal added successfully" };
  } catch (e) {
    console.log(e);
    if (
      e instanceof CategoryNotFoundError ||
      e instanceof CategoryGoalAlreadyExistsError
    ) {
      throw e; // Re-throw specific errors to be handled by the controller
    }
    throw new Error("Failed to add goal");
  }
};

const getMonthGoalsService = async (month: number, year: number) => {
  if (!month || !isValidMonthNumber(month)) {
    throw new Error("Invalid month provided");
  }
  if (!year || !isValidYearNumber(year)) {
    throw new Error("Invalid year provided");
  }

  try {
    return await db`
      SELECT g.id AS goal_id,
             g.goalAmount,
             g.notes,
             c.name AS category_name
      FROM expenses_month_goals g
      JOIN expenses_categories c ON g.category_id = c.id
      WHERE g.month = ${month} AND g.year = ${year};
    `;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to fetch goals");
  }
};

export {
  addExpenseService,
  getAllExpensesByDateService,
  getAllExpensesService,
  getAllCategoriesWithSubcategories,
  addCategoryService,
  addSubcategoryService,
  addMonthGoalsService,
  getMonthGoalsService,
};
