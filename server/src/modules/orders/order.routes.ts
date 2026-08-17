import { Router } from "express";
import {
  createOrderHandler,
  getOrderHandler,
  updateOrderStatusHandler,
} from "./order.controller";

const router = Router();

router.post("/", createOrderHandler);
router.get("/:id", getOrderHandler);
router.patch("/:id/status", updateOrderStatusHandler);

export default router;
