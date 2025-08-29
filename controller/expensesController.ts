import type { Request, Response } from "express";

import {
  addExpenseService,
  getAllExpensesService,
  getAllExpensesByDateService,
  getAllCategoriesWithSubcategories,
  addCategoryService,
  addSubcategoryService,
  addMonthGoalsService,
} from "../services/expensesServices.ts";
import {
  CategoryGoalAlreadyExistsError,
  CategoryNotFoundError,
  SubcategoryNotFoundError,
} from "../services/errors.ts";

import { AddExpenseDTO, AddMonthGoalsDTO } from "./types.dto.ts";
import {
  isValidDayNumber,
  isValidMonthNumber,
  isValidYearNumber,
} from "../lib/validators/dateValidators.ts";
import { ExpensesByDateService } from "../services/types.ts";

const expensesController = {
  addExpense: async (req: Request, res: Response) => {
    try {
      const { category, subcategory, amount, date, notes } =
        req.body as AddExpenseDTO;

      // if no date is provided, use the current date
      const currentDate = date ?? new Date();

      if (!category || !amount || !subcategory) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newDate = new Date(currentDate);
      if (isNaN(newDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      if (notes && typeof notes !== "string") {
        return res.status(400).json({ message: "Invalid notes" });
      }

      if (typeof category !== "string" || typeof subcategory !== "string") {
        return res
          .status(400)
          .json({ message: "Invalid category or subcategory" });
      }

      await addExpenseService({
        category,
        subcategory,
        amount,
        date: currentDate,
        notes,
      });

      res.status(201).json({ message: "expense added successfully" });
    } catch (error) {
      if (
        error instanceof CategoryNotFoundError ||
        error instanceof SubcategoryNotFoundError
      ) {
        res.status(400).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).send("Internal Server Error12");
      }
    }
  },
  getAllExpenses: async (_req: Request, res: Response) => {
    try {
      const expenses = await getAllExpensesService();
      res.status(200).json(expenses);
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to get expenses");
    }
  },
  getAllExpensesByDate: async (req: Request, res: Response) => {
    // fix this
    // make 3 services, one for day month year, one for monthyear, one for year
    // cant find way to make it work with one service
    const { day, month, year } = req.query;

    // INPUT VALIDATION
    if (!year) {
      return res.status(400).json({ error: "Year is required" });
    }
    const parsedYear = parseInt(year as string, 10);
    if (isNaN(parsedYear) || !isValidYearNumber(parsedYear)) {
      return res.status(400).json({ error: "Invalid year provided" });
    }

    const parsedMonth = parseInt(month as string, 10);
    if (
      parsedMonth !== undefined &&
      (isNaN(parsedMonth) || !isValidMonthNumber(parsedMonth))
    ) {
      return res.status(400).json({ error: "Invalid month provided" });
    }

    const parsedDay = parseInt(day as string, 10) || undefined;
    if (
      parsedDay !== undefined &&
      (isNaN(parsedDay) || !isValidDayNumber(parsedDay))
    ) {
      return res.status(400).json({ error: "Invalid day provided" });
    }

    try {
      const expenses = await getAllExpensesByDateService(
        parsedMonth,
        parsedYear
      );
      console.log(expenses);
      res.status(200).json(expenses);
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to get expenses");
    }
  },
  getAllCategoriesWithSubcategories: async (_req: Request, res: Response) => {
    try {
      const categories = await getAllCategoriesWithSubcategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to get categories");
    }
  },
  addCategory: async (req: Request, res: Response) => {
    try {
      const { category } = req.body;
      if (!category) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      await addCategoryService(category);

      res.status(201).json({ message: "Category added successfully" });
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        res.status(400).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    }
  },
  addSubcategory: async (req: Request, res: Response) => {
    try {
      const { category, subcategory } = req.body;
      if (!category || !subcategory) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      await addSubcategoryService(category, subcategory);

      res.status(201).json({ message: "Subcategory added successfully" });
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        res.status(400).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    }
  },
  addMonthGoals: async (req: Request, res: Response) => {
    try {
      const { month, year, category, goalAmount, notes } =
        req.body as AddMonthGoalsDTO;
      if (!month || !year || !category || !goalAmount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      await addMonthGoalsService(month, year, category, goalAmount, notes);

      res.status(201).json({ message: "Goals added successfully" });
    } catch (error) {
      console.log(error);
      if (
        error instanceof CategoryNotFoundError ||
        error instanceof CategoryGoalAlreadyExistsError
      ) {
        res.status(400).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    }
  },
  //   getGoalsByMonth: async (req: Request, res: Response) => {
  //     try {
  //       const { month, year } = req.query as { month: number; year: number };
  //       if (!month) {
  //         return res
  //           .status(400)
  //           .json({ message: "Missing required field month" });
  //       }

  //       if (isValidMonthNumber(month)) {
  //         return res.status(400).json({ message: "Invalid month" });
  //       }

  //       const currentYear = year ?? new Date().getFullYear();

  //       const goals = await getMonthGoalsService(month, currentYear);

  //       res.status(200).json(goals);
  //     } catch (error) {
  //       console.error(error);
  //       res.status(500).send("Internal Server Error");
  //     }
  //   },
};

export default expensesController;
