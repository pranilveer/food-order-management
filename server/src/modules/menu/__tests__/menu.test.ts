import request from "supertest";
import app from "../../../app";
import * as menuService from "../menu.service";

jest.mock("../menu.service");

const mockMenuService = menuService as jest.Mocked<typeof menuService>;

describe("GET /api/menu", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return available menu items", async () => {
    const mockItems = [
      {
        _id: "507f1f77bcf86cd799439011",
        name: "Margherita Pizza",
        description: "Classic pizza",
        price: 29900,
        image: "pizza.jpg",
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockMenuService.getAvailableMenuItems.mockResolvedValue(mockItems as any);

    const res = await request(app).get("/api/menu");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe("Margherita Pizza");
  });

  it("should return empty array when no items available", async () => {
    mockMenuService.getAvailableMenuItems.mockResolvedValue([]);

    const res = await request(app).get("/api/menu");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });

  it("should return 500 on server error", async () => {
    mockMenuService.getAvailableMenuItems.mockRejectedValue(
      new Error("Database error")
    );

    const res = await request(app).get("/api/menu");

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});
