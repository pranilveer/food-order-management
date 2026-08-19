import { Request, Response, NextFunction } from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
} from "./order.service";
import { createOrderSchema, updateOrderStatusSchema } from "./order.validation";

export const createOrderHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.errors.map((e) => e.message).join(", "),
      });
      return;
    }

    const order = await createOrder(parsed.data, req.user!.userId);

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getAllOrdersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let orders;
    if (req.user!.role === "admin") {
      orders = await getAllOrders();
    } else {
      orders = await getOrdersByUser(req.user!.userId);
    }
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ success: false, error: "Invalid order ID" });
      return;
    }

    const order = await getOrderById(id);

    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    if (req.user!.role !== "admin" && order.userId.toString() !== req.user!.userId) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ success: false, error: "Invalid order ID" });
      return;
    }

    const parsed = updateOrderStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: parsed.error.errors.map((e) => e.message).join(", "),
      });
      return;
    }

    const order = await updateOrderStatus(id, parsed.data.status);

    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
