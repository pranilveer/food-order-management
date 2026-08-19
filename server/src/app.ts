import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import menuRoutes from "./modules/menu/menu.routes";
import orderRoutes from "./modules/orders/order.routes";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(cors({
  origin: [
    "https://hotnspicy.vercel.app",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
