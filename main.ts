import express from "express";
import expensesRouter from "./router/expensesRouter.ts";

const port = Number(Deno.env.get("PORT")) || 4000;

const app = express();

const allowedOrigins = [
  "https://lassale-mu.vercel.app", // Production
  "https://lassale-mu.vercel.app/", // Production with trailing slash
  "http://localhost:3000", // Development
  "http://localhost:3000/", // Development with trailing slash
];

//  CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin ?? "";
  console.log("=== CORS DEBUG ===");
  console.log("Request origin:", `"${origin}"`);
  console.log("Allowed origins:", allowedOrigins);
  console.log("Origin found:", allowedOrigins.includes(origin));
  console.log("Origin length:", origin.length);
  console.log("==================");

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    console.log("✅ CORS origin set to:", origin);
  } else {
    console.log("❌ Origin not allowed - no CORS header set");
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
});

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
