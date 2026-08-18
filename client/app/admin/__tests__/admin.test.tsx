import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { ToastProvider } from "@/components/toast/ToastContext";
import * as api from "@/services/api";
import { Order } from "@/types";
import AdminPage from "../page";

jest.mock("@/services/api");

const mockApi = jest.mocked(api);

const mockOrders: Order[] = [
  {
    _id: "order1abc",
    items: [
      { menuItemId: "1", name: "Margherita Pizza", price: 29900, quantity: 2, subtotal: 59800 },
    ],
    customer: { name: "John Doe", address: "123 Main St", phone: "9999999999" },
    totalAmount: 59800,
    status: "ORDER_RECEIVED",
    createdAt: "2026-08-18T10:00:00.000Z",
    updatedAt: "2026-08-18T10:00:00.000Z",
  },
  {
    _id: "order2def",
    items: [
      { menuItemId: "2", name: "Pepperoni Pizza", price: 39900, quantity: 1, subtotal: 39900 },
    ],
    customer: { name: "Jane Smith", address: "456 Oak Ave", phone: "8888888888" },
    totalAmount: 39900,
    status: "PREPARING",
    createdAt: "2026-08-18T10:30:00.000Z",
    updatedAt: "2026-08-18T10:35:00.000Z",
  },
];

describe("AdminPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.getOrders.mockResolvedValue(mockOrders);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should show loading state", () => {
    render(<ToastProvider><AdminPage /></ToastProvider>);
    expect(screen.getByText("Loading orders...")).toBeInTheDocument();
  });

  it("should display orders after loading", async () => {
    render(<ToastProvider><AdminPage /></ToastProvider>);

    await waitFor(() => {
      expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("should show order stats", async () => {
    render(<ToastProvider><AdminPage /></ToastProvider>);

    await waitFor(() => {
      expect(screen.getByText("Total Orders")).toBeInTheDocument();
    });

    expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Active Orders")).toBeInTheDocument();
  });

  it("should show filter buttons", async () => {
    render(<ToastProvider><AdminPage /></ToastProvider>);

    await waitFor(() => {
      expect(screen.getByText("All")).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Received/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Preparing/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Out for Delivery/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Delivered/).length).toBeGreaterThanOrEqual(1);
  });

  it("should show error state", async () => {
    mockApi.getOrders.mockRejectedValue(new Error("Failed to load"));

    render(<ToastProvider><AdminPage /></ToastProvider>);

    await waitFor(() => {
      expect(screen.getByText("Failed to load")).toBeInTheDocument();
    });
  });
});
