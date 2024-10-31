import { Request, Response } from "express";
import {
  addService,
  getAllByCategoryService,
  getAllByDateService,
  getAllService,
} from "../services/expencesServices.ts";

const expencesController = {
  addExpence: async (req: Request, res: Response) => {
    try {
      await addService(req.body);
      res.status(201).json({ message: "Expence added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to add expence");
    }
  },
  getAllExpences: async (_req: any, res: any) => {
    try {
      const expences = await getAllService();
      res.status(200).json(expences);
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to get expences");
    }
  },
  getAllByCategory: async (req: Request, res: Response) => {
    const { category } = req.params;

    try {
      const expences = await getAllByCategoryService(category);
      res.status(200).json(expences);
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to get expences");
    }
  },
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
