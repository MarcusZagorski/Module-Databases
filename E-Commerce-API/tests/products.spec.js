import request from "supertest";
import app from "../app.js";

describe("GET /products", () => {
  it("Should return a list of all product names with their prices and supplier names", async () => {
    const response = await request(app).get("/products");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          product_name: expect.any(String),
          supplier_name: expect.any(String),
          unit_price: expect.any(Number),
        }),
      ])
    );
  });
});

describe("GET /products/:product", () => {
  it("Should return product, prices and supplier names based on product name", async () => {
    const testParam = "Mobile Phone X";
    const response = await request(app).get(`/products/${testParam}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          product_name: "Mobile Phone X",
          unit_price: expect.any(Number),
          supplier_name: expect.any(String),
        }),
      ])
    );
  });
});

describe("POST /products", () => {
  it("Should add a new product to the existing products", async () => {
    const newProduct = {
      product: "Macbook Pro",
    };
    const response = await request(app).post("/products").send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true });
  });
});

describe("POST /availability", () => {
  it("Should create a new product availability with a price and supplier ID", async () => {
    const productAvailable = {
      prod_id: 14,
      supplier_id: 4,
      price: 80,
    };
    const response = await request(app)
      .post("/availability")
      .send(productAvailable);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true });
  });
});
