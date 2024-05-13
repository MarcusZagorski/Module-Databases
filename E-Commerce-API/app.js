import express from "express";
import pg from "pg";
import "dotenv/config";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
const { Pool } = pg;
const port = process.env.PORT;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/products", (_, res) => {
  db.query(
    "SELECT prod.id, prod.product_name, ava.unit_price, sup.supplier_name FROM products prod JOIN product_availability ava ON (prod.id = ava.prod_id) JOIN suppliers sup ON (sup.id = ava.supp_id)"
  )
    .then((result) => res.status(200).send(result.rows))
    .catch((err) => res.status(500).send({ error: err }));
});

app.get("/products/:product", (req, res) => {
  const product = req.params.product;
  db.query(
    "SELECT prod.id, prod.product_name, ava.unit_price, sup.supplier_name FROM products prod JOIN product_availability ava ON (prod.id = ava.prod_id) JOIN suppliers sup ON (sup.id = ava.supp_id) WHERE lower(prod.product_name) LIKE lower($1 || '%')",
    [product]
  )
    .then((result) => res.status(200).send(result.rows))
    .catch((err) => res.status(500).send({ error: err }));
});

app.get("/customers/", (_, res) => {
  db.query("SELECT * FROM customers")
    .then((result) => res.status(200).send(result.rows))
    .catch((err) => res.status(500).send({ error: err }));
});

app.get("/customers/:id", (req, res) => {
  const customerId = parseInt(req.params.id);
  db.query("SELECT * FROM customers WHERE id = $1", [customerId])
    .then((result) => res.status(200).send(result.rows))
    .catch((err) => res.status(500).send({ error: err }));
});

app.post("/customers", async (req, res) => {
  const usersName = req.body.name;
  const usersAddress = req.body.address;
  const usersCity = req.body.city;
  const usersCountry = req.body.country;

  try {
    await db.query(
      "INSERT INTO customers (name, address, city, country) VALUES ($1, $2, $3, $4)",
      [usersName, usersAddress, usersCity, usersCountry]
    );
    res.status(201).send({ success: true });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

app.post("/products", async (req, res) => {
  const newProduct = req.body.product;

  try {
    await db.query("INSERT INTO products (product_name) VALUES ($1)", [
      newProduct,
    ]);
    res.status(201).send({ success: true });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

app.post("/availability", async (req, res) => {
  const productID = req.body.prod_id;
  const supplierID = req.body.supplier_id;
  const price = req.body.price;

  const checkProductExists = await db.query(
    "SELECT * FROM products WHERE id = $1",
    [productID]
  );

  const checkSupplierExists = await db.query(
    "SELECT * FROM suppliers WHERE id = $1",
    [supplierID]
  );

  try {
    await db.query(
      "INSERT INTO product_availability (prod_id, supp_id, unit_price) VALUES ($1, $2, $3)",
      [productID, supplierID, price]
    );
    res.status(201).send({ success: true });
  } catch (err) {
    if (price <= 0) {
      res.status(500).send({ error: "Price cannot be a negative value or 0" });
    } else if (checkProductExists.rows.length == 0) {
      res.status(500).send({ error: "Product id does not exist" });
    } else if (checkSupplierExists.rows.length == 0) {
      res.status(500).send({ error: "Supplier id does not exist" });
    } else {
      res.status(500).send({ error: err });
    }
  }
});

app.post("customers/:customerId/orders", async (req, res) => {
  const customerId = req.params.customerId;
  const orderDate = req.body.order_date;

  try {
  } catch (err) {}
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

export default app;
