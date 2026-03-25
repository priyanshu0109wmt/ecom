// ================= IMPORTS =================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// ================= SERVE STATIC IMAGES =================
const path = require("path");

// correct absolute path
app.use("/images", express.static(path.join(__dirname, "images")));
// ================= ROOT API =================
// check server working
app.get("/", (req,res)=>{
res.send("Server running");
});


// ================= ADD PRODUCT API =================
// add product with name, price, image
app.post("/add-product",(req,res)=>{

const {name,price,image,category} = req.body;

const sql = "INSERT INTO products (name,price,image,category) VALUES (?,?,?,?)";

db.query(sql,[name,price,image,category],(err,result)=>{

if(err){
return res.send(err);
}
else{
res.send("Product Added Successfully");
}

});

});


// ================= GET ALL PRODUCTS =================
// fetch all products
app.get("/products",(req,res)=>{

const sql = "SELECT * FROM products";

db.query(sql,(err,result)=>{

if(err){
return res.send(err);
}
else{
res.json(result);
}

});

});


// ================= ADD TO CART (WITH QUANTITY SYSTEM) =================
// if product exists → increase quantity
// else → insert new
app.post("/add-to-cart",(req,res)=>{

const {product_id,user_id} = req.body;
// check if already exists
const checkSql = "SELECT * FROM cart WHERE product_id=? AND user_id=?";
db.query(checkSql,[product_id,user_id],(err,result)=>{

if(err){
return res.send(err);
}

if(result.length > 0){

// update quantity
const updateSql = "UPDATE cart SET quantity = quantity + 1 WHERE product_id=? AND user_id=?";
db.query(updateSql,[product_id,user_id],(err)=>{

if(err){
return res.send(err);
}

res.send("Quantity updated");

});

}else{

// insert new product
const insertSql = "INSERT INTO cart (product_id,quantity,user_id) VALUES (?,?,?)";
db.query(insertSql,[product_id,1,user_id],(err)=>{

if(err){
return res.send(err);
}

res.send("Added to cart");

});

}

});

});


// ================= GET CART ITEMS (USER-SPECIFIC + FIXED) =================
app.get("/cart/:user_id",(req,res)=>{

const user_id = req.params.user_id;

const sql = `
SELECT cart.product_id, products.name, products.price, products.image, cart.quantity
FROM cart
JOIN products ON cart.product_id = products.id
WHERE cart.user_id = ?
`;

db.query(sql,[user_id],(err,result)=>{

if(err){
return res.send(err);
}
else{
res.json(result);
}

});

});


// ================= REMOVE ITEM FROM CART =================
// delete one item using cart id
app.post("/remove-from-cart",(req,res)=>{

const {product_id, user_id} = req.body;

const sql = "DELETE FROM cart WHERE product_id=? AND user_id=?";

db.query(sql,[product_id, user_id],(err)=>{

if(err){
return res.send(err);
}
else{
res.send("Item removed");
}

});

});


// ================= CHECKOUT API =================
// save order + clear cart
app.post("/checkout",(req,res)=>{

const {total,user_id} = req.body;

const sql = "INSERT INTO orders (total_price,user_id) VALUES (?,?)";

db.query(sql,[total,user_id],(err,result)=>{

if(err){
return res.send(err);
}
else{

db.query("DELETE FROM cart WHERE user_id=?", [user_id]);
res.send("Order placed successfully");

}

});

});


// ================= ORDER HISTORY API =================
// fetch all orders
app.get("/orders/:user_id",(req,res)=>{

const user_id = req.params.user_id;

const sql = "SELECT * FROM orders WHERE user_id=?";

db.query(sql,[user_id],(err,result)=>{

if(err){
return res.send(err);
}
else{
res.json(result);
}

});

});


// ================= DELETE PRODUCT API =================
// delete product from database
app.post("/delete-product",(req,res)=>{

const {id} = req.body;

const sql = "DELETE FROM products WHERE id=?";

db.query(sql,[id],(err,result)=>{

if(err){
return res.send(err);
}
else{
res.send("Product deleted");
}

});

});


// ================= SERVER START =================
//app.listen(5000, ()=>{
//console.log("Server running on port 5000");
//});

// ================= SIGNUP API =================
app.post("/signup",(req,res)=>{

const {username,password} = req.body;

const sql = "INSERT INTO users (username,password,role) VALUES (?,?,?)";

db.query(sql,[username,password,"user"],(err,result)=>{

if(err){
return res.send(err);
}
else{
res.send("User Registered Successfully");
}

});

});

// ================= LOGIN API =================
app.post("/login",(req,res)=>{

const {username,password} = req.body;

const sql = "SELECT * FROM users WHERE username=? AND password=?";

db.query(sql,[username,password],(err,result)=>{

if(err){
return res.send(err);
}

if(result.length > 0){
res.json({
message:"Login Successful",
user: result[0]
});
}else{
res.send("Invalid Credentials");
}

});

});

// ================= UPDATE CART QUANTITY =================
app.post("/update-cart",(req,res)=>{

const {product_id,user_id,action} = req.body;

// ➕ Increase
if(action === "increase"){

const sql = "UPDATE cart SET quantity = quantity + 1 WHERE product_id=? AND user_id=?";

db.query(sql,[product_id,user_id],(err)=>{
if(err) return res.send(err);
res.send("Increased");
});

}

// ➖ Decrease
else if(action === "decrease"){

// check current quantity
const checkSql = "SELECT quantity FROM cart WHERE product_id=? AND user_id=?";

db.query(checkSql,[product_id,user_id],(err,result)=>{

if(err) return res.send(err);

if(result.length > 0 && result[0].quantity > 1){

const sql = "UPDATE cart SET quantity = quantity - 1 WHERE product_id=? AND user_id=?";

db.query(sql,[product_id,user_id],()=>{
res.send("Decreased");
});

}else{

// remove if quantity = 1
const delSql = "DELETE FROM cart WHERE product_id=? AND user_id=?";

db.query(delSql,[product_id,user_id],()=>{
res.send("Item removed");
});

}

});

}

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
console.log("Server running on port", PORT);
});