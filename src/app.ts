import express, { type Application } from "express";
import cors from "cors";
import config from "./config";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { authRouter } from "./modules/auth/auth.route";
import globalErrorHandler from "./middlewire/globalErrorHandler";


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


//* error handler
app.use(globalErrorHandler);


export default app;
