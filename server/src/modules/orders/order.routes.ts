import { Router } from "express";
import {
  createOrderHandler,
  getAllOrdersHandler,
  getOrderHandler,
  updateOrderStatusHandler,
} from "./order.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";

const router = Router();

router.get("/", requireAuth, getAllOrdersHandler);
router.post("/", requireAuth, createOrderHandler);
router.get("/:id", requireAuth, getOrderHandler);
router.patch("/:id/status", requireAuth, requireAdmin, updateOrderStatusHandler);

export default router;
