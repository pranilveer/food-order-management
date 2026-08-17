import request from "supertest";
import app from "../app";

describe("404 handler", () => {
  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/api/nonexistent");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      error: "Route not found",
    });
  });
});
