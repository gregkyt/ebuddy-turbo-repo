import express, { Router } from "express";
import cors from "cors";
import userRoute from "../routes/user";
import { validateHeader } from "@/middleware/authMiddleware";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const routes: Record<string, Router> = { user: userRoute };
Object.keys(routes).map((item) => {
  app.use(`/api/${item}`, routes[item]);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export { app, port };
