import { Request, Response, Router } from "express";
import controller from "../controller/expencesController.ts";

const expencesRouter = Router();

expencesRouter.get("/", (_req: Request, res: Response) => {
  res.send("Hello from expences routes");
});

expencesRouter.post("/add", async (req: Request, res: Response) => {
  try {
    await controller.addExpence(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

expencesRouter.get("/all", async (_req: Request, res: Response) => {
  try {
    await controller.getAllExpences(_req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

expencesRouter.get(
  "/all/category/:category",
  async (req: Request, res: Response) => {
    try {
      await controller.getAllByCategory(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  }
);

expencesRouter.get("/all/date", async (req: Request, res: Response) => {
  try {
    await controller.getAllByDate(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

export default expencesRouter;
