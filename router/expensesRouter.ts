import { Request, Response, Router } from "express";
import controller from "../controller/expensesController.ts";

const expensesRouter = Router();

expensesRouter.get("/", (_req: Request, res: Response) => {
  res.send("Hello from expenses routes");
});

expensesRouter.post("/add", async (req: Request, res: Response) => {
  try {
    await controller.addExpense(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

expensesRouter.get("/all", async (_req: Request, res: Response) => {
  try {
    await controller.getAllExpenses(_req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// expensesRouter.get(
//   "/all/category/:category",
//   async (req: Request, res: Response) => {
//     try {
//       await controller.getAllByCategory(req, res);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send();
//     }
//   },
// );

expensesRouter.get("/all/date", async (req: Request, res: Response) => {
  try {
    await controller.getAllExpensesByDate(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

expensesRouter.get("/categories", async (_req: Request, res: Response) => {
  try {
    await controller.getAllCategoriesWithSubcategories(_req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

expensesRouter.post("/categories/add", async (req: Request, res: Response) => {
  try {
    await controller.addCategory(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});
// addMonthGoalsService
expensesRouter.post("/monthGoals/add", async (req: Request, res: Response) => {
  try {
    await controller.addMonthGoals(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

export default expensesRouter;
