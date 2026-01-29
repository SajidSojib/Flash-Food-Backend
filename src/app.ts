import express, { type Application } from "express";
import cors from "cors";
import config from "./config";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { authRouter } from "./modules/auth/auth.route";
import globalErrorHandler from "./middlewire/globalErrorHandler";
import notFound from "./middlewire/notFound";
import { providerRouter } from "./modules/provider/provider.route";
import { categoryRouter } from "./modules/category/category.route";
import { mealRouter } from "./modules/meal/meal.route";
import { orderRouter } from "./modules/order/order.route";


const app: Application = express();

//* middlewares
app.use(express.json());
app.use(
  cors({
    origin: config.frontend_url,
    credentials: true,
  }),
);


//* routes
app.get("/", (req, res) => {
  res.send("Welcome to Flash Food");
});

app.use("/api/auth", authRouter);
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/providers", providerRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/meals", mealRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", orderRouter);


//* error handler
app.use(notFound);
app.use(globalErrorHandler);


export default app;
