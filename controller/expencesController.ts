import { Request, Response } from "express";
import {
  addService,
  // getAllByCategoryService,
  getAllByDateService,
  getAllService,
} from "../services/expencesServices.ts";
import { Expense } from "../services/types.ts";

const expencesController = {
  addExpence: async (req: Request, res: Response) => {
    try {
      const { category, subcategory, amount, date, notes } =
        req.body as Expense; // TODO: check if this is the correct way to type the body

      // if no date is provided, use the current date
      const currentDate = date ?? new Date().toISOString().split("T")[0];

      if (!category || !amount || !subcategory) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      await addService({
        category,
        subcategory,
        amount,
        date: currentDate,
        notes,
      });

      res.status(201).json({ message: "Expence added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to add expence");
    }
  },
  getAllExpences: async (_req: Request, res: Response) => {
    try {
      const expences = await getAllService();
      res.status(200).json(expences);
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to get expences");
    }
  },
  // getAllByCategory: async (req: Request, res: Response) => {
  //   const { category } = req.params;

  //   try {
  //     const expences = await getAllByCategoryService(category);
  //     res.status(200).json(expences);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send("Failed to get expences");
  //   }
  // },
  getAllByDate: async (req: Request, res: Response) => {
    const { day, month, year } = req.query;

    try {
      const expences = await getAllByDateService(month, year, day);
      res.status(200).json(expences);
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to get expences");
    }
  },
};

export default expencesController;
