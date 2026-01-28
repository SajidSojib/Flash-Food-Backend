import express, { type Application } from "express";
import cors from "cors";

const app: Application = express();

//* middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

export default app;
