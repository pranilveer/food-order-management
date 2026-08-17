import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import OrderStatusPage from "../[id]/page";

jest.mock("@/services/api", () => ({
  getOrderById: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "order123" }),
}));

jest.mock("next/link", () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

const { getOrderById } = require("@/services/api");

const mockOrder = {
  _id: "order123abc",
  items: [
    { menuItemId: "1", name: "Margherita Pizza", price: 29900, quantity: 2, subtotal: 59800 },
    { menuItemId: "2", name: "Pepperoni Pizza", price: 39900, quantity: 1, subtotal: 39900 },
  ],
  customer: {
    name: "John Doe",
    address: "123 Main St, Mumbai",
    phone: "9999999999",
  },
  totalAmount: 99700,
  status: "PREPARING" as const,
  createdAt: "2026-08-18T10:00:00.000Z",
  updatedAt: "2026-08-18T10:15:00.000Z",
};

describe("OrderStatusPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getOrderById.mockResolvedValue(mockOrder);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should show loading state initially", () => {
    render(<OrderStatusPage />);
    expect(screen.getByText("Loading order details...")).toBeInTheDocument();
  });

  it("should display order details after loading", async () => {
    render(<OrderStatusPage />);

    await waitFor(() => {
      expect(screen.getByText("Order Status")).toBeInTheDocument();
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("123 Main St, Mumbai")).toBeInTheDocument();
    expect(screen.getByText("9999999999")).toBeInTheDocument();
  });

  it("should display order items and total", async () => {
    render(<OrderStatusPage />);

    await waitFor(() => {
      expect(screen.getByText("Margherita Pizza x 2")).toBeInTheDocument();
    });

    expect(screen.getByText("Pepperoni Pizza x 1")).toBeInTheDocument();
    expect(screen.getByText("₹997")).toBeInTheDocument();
  });

  it("should show correct status steps", async () => {
    render(<OrderStatusPage />);

    await waitFor(() => {
      expect(screen.getByText("Order Received")).toBeInTheDocument();
    });

    expect(screen.getByText("Preparing")).toBeInTheDocument();
    expect(screen.getByText("Out for Delivery")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });

  it("should show error state", async () => {
    getOrderById.mockRejectedValue(new Error("Order not found"));

    render(<OrderStatusPage />);

    await waitFor(() => {
      expect(screen.getByText("Order not found")).toBeInTheDocument();
    });
  });
});
