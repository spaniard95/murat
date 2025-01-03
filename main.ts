import express from "express";
import expensesRouter from "./router/expensesRouter.ts";

const port = Number(Deno.env.get("PORT")) || 4000;

const app = express();

app.use(express.json());
app.use("/expenses", expensesRouter);

app.listen(port, () => {
  console.log("Server is running on port", port);
});

// BEFORE NEW REQUESTS AND FEATURES, FIX AND CLEAN THE ALREADY ESTABLISHED CODE AND STRUCTURE

// add dto for the requests
// CHECK: do i need the router layer or should i just use the controller layer?
// create checker functions, that look on the db if this exists

// TODO: ts clean up
// TODO: tasks like es lint on commit
// TODO: add tests
// simple like returns 400 with message if no category is provided

// TODO: table or request for previous months expenses (maybe a reccuring entry every previous month or done when the user finalizes it)
// should i make calculations in the service or should be done on the fe?
// ex. total amount of expenses for a month, or year.

// fix github actions
// check if they do anything at all and if they are needed

// maybe group requests by get, post, put, delete
// THINK: maybe the controller should do only the required checks in the context of the controller and the services should do the rest
// the service probably should be on itself foolproof and the controller should only check validations that are specific to the controller
// ex. this request requres a category and a subcategory => check on the controller
// ex. type validations => check on the service

// add dto for the requests
