import mongoose, { Schema, Document } from "mongoose";

export type OrderStatus =
  | "ORDER_RECEIVED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

export interface IOrderItem {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface IOrder extends Document {
  items: IOrderItem[];
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  totalAmount: number;
  status: OrderStatus;
}

const orderItemSchema = new Schema<IOrderItem>({
  menuItemId: { type: Schema.Types.ObjectId, required: true, ref: "MenuItem" },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true, min: 0 },
});

const orderSchema = new Schema<IOrder>(
  {
    items: { type: [orderItemSchema], required: true, validate: {
      validator: (items: IOrderItem[]) => items.length > 0,
      message: "Order must have at least one item",
    }},
    customer: {
      name: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["ORDER_RECEIVED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"],
      default: "ORDER_RECEIVED",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
