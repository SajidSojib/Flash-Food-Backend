import express, { type Application } from "express";
import cors from "cors";
import config from "./config";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";


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

app.all("/api/auth/{*any}", toNodeHandler(auth));


export default app;
