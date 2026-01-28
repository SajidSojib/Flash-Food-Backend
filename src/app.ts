import express, { type Application } from "express";
import cors from "cors";
import config from "./config";

const app: Application = express();

//* middlewares
app.use(express.json());
app.use(
  cors({
    origin: config.frontend_url,
    credentials: true,
  }),
);

export default app;
