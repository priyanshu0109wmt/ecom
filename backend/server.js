// ================= IMPORTS =================
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

// ================= APP INIT =================
const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= HEALTH ROUTE =================
app.get("/health", (req, res) => {
  res.send("OK");
});

// ================= STATIC IMAGES =================
app.use("/images", express.static(path.join(__dirname, "images")));

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// ================= SIGNUP =================
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  const sql = "INSERT INTO users (username,password,role) VALUES (?,?,?)";

  db.query(sql, [username, password, "user"], (err) => {
    if (err) return res.status(500).send(err);
    res.send("User Registered Successfully");
  });
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username=? AND password=?";

  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length > 0) {
      res.json({
        message: "Login Successful",
        user: result[0],
      });
    } else {
      res.status(401).send("Invalid Credentials");
    }
  });
});

// ================= PRODUCTS =================
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post("/add-product", (req, res) => {
  const { name, price, image, category } = req.body;

  const sql =
    "INSERT INTO products (name,price,image,category) VALUES (?,?,?,?)";

  db.query(sql, [name, price, image, category], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Product Added Successfully");
  });
});

app.post("/delete-product", (req, res) => {
  const { id } = req.body;

  db.query("DELETE FROM products WHERE id=?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Product deleted");
  });
});

// ================= CART =================
app.post("/add-to-cart", (req, res) => {
  const { product_id, user_id } = req.body;

  const checkSql =
    "SELECT * FROM cart WHERE product_id=? AND user_id=?";

  db.query(checkSql, [product_id, user_id], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length > 0) {
      db.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE product_id=? AND user_id=?",
        [product_id, user_id],
        (err) => {
          if (err) return res.status(500).send(err);
          res.send("Quantity updated");
        }
      );
    } else {
      db.query(
        "INSERT INTO cart (product_id,quantity,user_id) VALUES (?,?,?)",
        [product_id, 1, user_id],
        (err) => {
          if (err) return res.status(500).send(err);
          res.send("Added to cart");
        }
      );
    }
  });
});

app.get("/cart/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  const sql = `
    SELECT cart.product_id, products.name, products.price, products.image, cart.quantity
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post("/remove-from-cart", (req, res) => {
  const { product_id, user_id } = req.body;

  db.query(
    "DELETE FROM cart WHERE product_id=? AND user_id=?",
    [product_id, user_id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Item removed");
    }
  );
});

// ================= UPDATE CART =================
app.post("/update-cart", (req, res) => {
  const { product_id, user_id, action } = req.body;

  if (action === "increase") {
    db.query(
      "UPDATE cart SET quantity = quantity + 1 WHERE product_id=? AND user_id=?",
      [product_id, user_id],
      (err) => {
        if (err) return res.status(500).send(err);
        res.send("Increased");
      }
    );
  }

  else if (action === "decrease") {
    db.query(
      "SELECT quantity FROM cart WHERE product_id=? AND user_id=?",
      [product_id, user_id],
      (err, result) => {
        if (err) return res.status(500).send(err);

        if (result.length > 0 && result[0].quantity > 1) {
          db.query(
            "UPDATE cart SET quantity = quantity - 1 WHERE product_id=? AND user_id=?",
            [product_id, user_id],
            () => res.send("Decreased")
          );
        } else {
          db.query(
            "DELETE FROM cart WHERE product_id=? AND user_id=?",
            [product_id, user_id],
            () => res.send("Item removed")
          );
        }
      }
    );
  }
});

// ================= CHECKOUT =================
app.post("/checkout", (req, res) => {
  const { total, user_id } = req.body;

  db.query(
    "INSERT INTO orders (total_price,user_id) VALUES (?,?)",
    [total, user_id],
    (err) => {
      if (err) return res.status(500).send(err);

      db.query("DELETE FROM cart WHERE user_id=?", [user_id]);
      res.send("Order placed successfully");
    }
  );
});

// ================= ORDERS =================
app.get("/orders/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  db.query(
    "SELECT * FROM orders WHERE user_id=?",
    [user_id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

// ================= SERVER =================
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});