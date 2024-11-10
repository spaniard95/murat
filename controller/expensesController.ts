import { Request, Response } from "express";
import {
  addExpenseService,
  // getAllByCategoryService,
  getAllExpensesService,
  getAllExpensesByDateService,
  CategoryNotFoundError,
  SubcategoryNotFoundError,
  getAllCategoriesWithSubcategories,
} from "../services/expensesServices.ts";
import { Expense } from "../services/types.ts";

const expensesController = {
  addExpense: async (req: Request, res: Response) => {
    try {
      const { category, subcategory, amount, date, notes } =
        req.body as Expense; // TODO: check if this is the correct way to type the body

      // if no date is provided, use the current date
      const currentDate = date ?? new Date().toISOString().split("T")[0];

      if (!category || !amount || !subcategory) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate the input
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
  // getAllByCategory: async (req: Request, res: Response) => {
  //   const { category } = req.params;

  //   try {
  //     const expenses = await getAllByCategoryService(category);
  //     res.status(200).json(expenses);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send("Failed to get expenses");
  //   }
  // },
  getAllExpensesByDate: async (req: Request, res: Response) => {
    const { day, month, year } = req.query;

    try {
      const expenses = await getAllExpensesByDateService(month, year, day);
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
};

export default expensesController;
