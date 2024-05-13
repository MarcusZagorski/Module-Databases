import request from "supertest";
import app from "../app";

describe("GET /customers", () => {
  it("Should return all the customers and there details", async () => {
    const response = await request(app).get("/customers");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          address: expect.any(String),
          city: expect.any(String),
          country: expect.any(String),
        }),
      ])
    );
  });
});

describe("GET /customers/:id", () => {
  it("Should return a specific customer based on the ID entered", async () => {
    const testParam = 1;
    const response = await request(app).get(`/customers/${testParam}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        name: "Guy Crawford",
        address: "770-2839 Ligula Road",
        city: "Paris",
        country: "France",
      },
    ]);
  });
});

describe("/POST /customers", () => {
  it("Should return a success message if new customer has been posted", async () => {
    const newCustomer = {
      name: "Marcus Zagorski",
      address: "31 Holford Avenue",
      city: "Birmingham",
      country: "UK",
    };
    const response = await request(app).post("/customers").send(newCustomer);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true });
  });
});
