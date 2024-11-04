import express from "express";
import expencesRouter from "./router/expencesRouter.ts";

const port = Number(Deno.env.get("PORT")) || 3000;

const app = express();

app.use(express.json());
app.use("/expences", expencesRouter);

app.listen(port, () => {
  console.log("Server is running on port", port);
});

// CHECK: Add error handling middleware
// TODO: ts clean up
// TODO: tasks like es lint on commit
