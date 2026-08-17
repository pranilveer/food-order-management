import express from "express";
import cors from "cors";
import menuRoutes from "./modules/menu/menu.routes";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/menu", menuRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
