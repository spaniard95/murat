import express from "express";
import expencesRouter from "./router/expencesRouter.ts";

const port = Number(Deno.env.get("PORT")) || 3000;

const app = express();

app.use(express.json());
app.use("/expences", expencesRouter);

app.listen(port, () => {
  console.log("Server is running on port", port);
});

// BEFORE NEW REQUESTS AND FEATURES, FIX AND CLEAN THE ALREADY ESTABLISHED CODE AND STRUCTURE

// CHECK: Add error handling middleware
// THINK: should i create a type like Expense in a way that on the controller that will automatically validate if the fields are appropriate?
// do a hybrid ts and runtime type

// TODO: ts clean up
// TODO: tasks like es lint on commit
// TODO: add tests
// simple like returns 400 message if no category is provided

// TODO: new request //add a new category & subcategory
// do it first diferent and then check for one more dynamic that maybe inserts both at the same time
// TODO: new request monthGoals
// THINK: should i add a new table for the goals or should i add a new column in the expenses table?

// TODO: table or request for previous months expences (maybe a reccuring entry every previous month or done when the user finalizes it)
// should i make calculations in the service or should be done on the fe?
// ex. total amount of expenses for a month, or year.

// fix github actions
// check if they do anything at all and if they are needed
