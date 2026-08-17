import mongoose from "mongoose";
import Order, { IOrder } from "./order.model";
import MenuItem from "../menu/menu.model";
import { CreateOrderInput } from "./order.validation";

export const createOrder = async (input: CreateOrderInput): Promise<IOrder> => {
  const menuItems = await MenuItem.find({
    _id: { $in: input.items.map((i) => i.menuItemId) },
  });

  const menuItemMap = new Map(
    menuItems.map((item) => [item._id.toString(), item])
  );

  const orderItems = input.items.map((item) => {
    const menuItem = menuItemMap.get(item.menuItemId);

    if (!menuItem) {
      throw Object.assign(new Error(`Menu item not found: ${item.menuItemId}`), {
        statusCode: 400,
      });
    }

    if (!menuItem.isAvailable) {
      throw Object.assign(
        new Error(`Menu item is not available: ${menuItem.name}`),
        { statusCode: 400 }
      );
    }

    const subtotal = menuItem.price * item.quantity;

    return {
      menuItemId: new mongoose.Types.ObjectId(item.menuItemId),
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
      subtotal,
    };
  });

  const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  const order = await Order.create({
    items: orderItems,
    customer: input.customer,
    totalAmount,
    status: "ORDER_RECEIVED",
  });

  return order;
};

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  return Order.findById(id);
};

export const updateOrderStatus = async (
  id: string,
  status: string
): Promise<IOrder | null> => {
  const order = await Order.findById(id);

  if (!order) {
    return null;
  }

  const validTransitions: Record<string, string[]> = {
    ORDER_RECEIVED: ["PREPARING"],
    PREPARING: ["OUT_FOR_DELIVERY"],
    OUT_FOR_DELIVERY: ["DELIVERED"],
    DELIVERED: [],
  };

  const allowed = validTransitions[order.status];

  if (!allowed || !allowed.includes(status)) {
    throw Object.assign(
      new Error(
        `Invalid status transition from ${order.status} to ${status}`
      ),
      { statusCode: 400 }
    );
  }

  order.status = status as any;
  await order.save();

  return order;
};
