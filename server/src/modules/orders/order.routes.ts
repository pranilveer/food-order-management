import { Router } from "express";
import {
  createOrderHandler,
  getAllOrdersHandler,
  getOrderHandler,
  updateOrderStatusHandler,
} from "./order.controller";

const router = Router();

router.get("/", getAllOrdersHandler);
router.post("/", createOrderHandler);
router.get("/:id", getOrderHandler);
router.patch("/:id/status", updateOrderStatusHandler);

export default router;
