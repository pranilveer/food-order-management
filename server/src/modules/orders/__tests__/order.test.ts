import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../../app";
import * as orderService from "../order.service";

jest.mock("../order.service");

const mockOrderService = orderService as jest.Mocked<typeof orderService>;

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

const generateToken = (payload: { userId: string; email: string; role: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

const userToken = generateToken({ userId: "507f1f77bcf86cd799439011", email: "test@test.com", role: "customer" });
const adminToken = generateToken({ userId: "507f1f77bcf86cd799439099", email: "admin@test.com", role: "admin" });

describe("POST /api/orders", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const validOrder = {
    items: [{ menuItemId: "507f1f77bcf86cd799439011", quantity: 2 }],
    customer: {
      name: "John Doe",
      address: "123 Main St",
      phone: "9999999999",
    },
  };

  it("should return 401 without auth token", async () => {
    const res = await request(app).post("/api/orders").send(validOrder);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 with invalid token", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", "Bearer invalid-token")
      .send(validOrder);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should create an order successfully", async () => {
    const mockOrder = {
      _id: "507f1f77bcf86cd799439012",
      userId: "507f1f77bcf86cd799439011",
      items: [
        {
          menuItemId: "507f1f77bcf86cd799439011",
          name: "Margherita Pizza",
          price: 29900,
          quantity: 2,
          subtotal: 59800,
        },
      ],
      customer: validOrder.customer,
      totalAmount: 59800,
      status: "ORDER_RECEIVED",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockOrderService.createOrder.mockResolvedValue(mockOrder as any);

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send(validOrder);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalAmount).toBe(59800);
    expect(res.body.data.status).toBe("ORDER_RECEIVED");
  });

  it("should return 400 for empty items", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ items: [], customer: validOrder.customer });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 for missing customer name", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        items: validOrder.items,
        customer: { address: "123 Main St", phone: "9999999999" },
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 for invalid phone number", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        items: validOrder.items,
        customer: { ...validOrder.customer, phone: "123" },
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 for invalid quantity", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        items: [{ menuItemId: "507f1f77bcf86cd799439011", quantity: -1 }],
        customer: validOrder.customer,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 when menu item not found", async () => {
    mockOrderService.createOrder.mockRejectedValue(
      Object.assign(new Error("Menu item not found"), { statusCode: 400 })
    );

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send(validOrder);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 500 on server error", async () => {
    mockOrderService.createOrder.mockRejectedValue(
      new Error("Database error")
    );

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send(validOrder);

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/orders", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 without auth token", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.status).toBe(401);
  });

  it("should return user's orders for regular user", async () => {
    const mockOrders = [
      {
        _id: "507f1f77bcf86cd799439012",
        userId: "507f1f77bcf86cd799439011",
        items: [],
        customer: { name: "John", address: "123", phone: "9999999999" },
        totalAmount: 0,
        status: "ORDER_RECEIVED",
      },
    ];

    mockOrderService.getOrdersByUser.mockResolvedValue(mockOrders as any);

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockOrderService.getOrdersByUser).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
  });

  it("should return all orders for admin user", async () => {
    const mockOrders = [
      {
        _id: "507f1f77bcf86cd799439012",
        userId: "507f1f77bcf86cd799439011",
        items: [],
        customer: { name: "John", address: "123", phone: "9999999999" },
        totalAmount: 0,
        status: "ORDER_RECEIVED",
      },
    ];

    mockOrderService.getAllOrders.mockResolvedValue(mockOrders as any);

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockOrderService.getAllOrders).toHaveBeenCalled();
  });
});

describe("GET /api/orders/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 without auth token", async () => {
    const res = await request(app).get("/api/orders/507f1f77bcf86cd799439012");
    expect(res.status).toBe(401);
  });

  it("should return an order by ID for the owner", async () => {
    const mockOrder = {
      _id: "507f1f77bcf86cd799439012",
      userId: "507f1f77bcf86cd799439011",
      items: [],
      customer: { name: "John", address: "123", phone: "9999999999" },
      totalAmount: 0,
      status: "ORDER_RECEIVED",
    };

    mockOrderService.getOrderById.mockResolvedValue(mockOrder as any);

    const res = await request(app)
      .get("/api/orders/507f1f77bcf86cd799439012")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe("507f1f77bcf86cd799439012");
  });

  it("should return 404 for order belonging to another user", async () => {
    const mockOrder = {
      _id: "507f1f77bcf86cd799439012",
      userId: "507f1f77bcf86cd799439099",
      items: [],
      customer: { name: "Other", address: "456", phone: "1111111111" },
      totalAmount: 0,
      status: "ORDER_RECEIVED",
    };

    mockOrderService.getOrderById.mockResolvedValue(mockOrder as any);

    const res = await request(app)
      .get("/api/orders/507f1f77bcf86cd799439012")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Order not found");
  });

  it("should return 400 for invalid ID format", async () => {
    const res = await request(app)
      .get("/api/orders/invalid-id")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Invalid order ID");
  });

  it("should return 404 for non-existent order", async () => {
    mockOrderService.getOrderById.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/orders/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Order not found");
  });

  it("should allow admin to access any order", async () => {
    const mockOrder = {
      _id: "507f1f77bcf86cd799439012",
      userId: "507f1f77bcf86cd799439011",
      items: [],
      customer: { name: "John", address: "123", phone: "9999999999" },
      totalAmount: 0,
      status: "ORDER_RECEIVED",
    };

    mockOrderService.getOrderById.mockResolvedValue(mockOrder as any);

    const res = await request(app)
      .get("/api/orders/507f1f77bcf86cd799439012")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("PATCH /api/orders/:id/status", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 without auth token", async () => {
    const res = await request(app)
      .patch("/api/orders/507f1f77bcf86cd799439012/status")
      .send({ status: "PREPARING" });
    expect(res.status).toBe(401);
  });

  it("should return 403 for non-admin user", async () => {
    const res = await request(app)
      .patch("/api/orders/507f1f77bcf86cd799439012/status")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ status: "PREPARING" });
    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Admin access required");
  });

  it("should update status for admin user", async () => {
    const mockOrder = {
      _id: "507f1f77bcf86cd799439012",
      status: "PREPARING",
    };

    mockOrderService.updateOrderStatus.mockResolvedValue(mockOrder as any);

    const res = await request(app)
      .patch("/api/orders/507f1f77bcf86cd799439012/status")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "PREPARING" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
