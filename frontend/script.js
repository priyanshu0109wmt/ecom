/* ================= ADD PRODUCT ================= */
function addProduct(){

const name = document.getElementById("name").value;
const price = document.getElementById("price").value;
const category = document.getElementById("category").value;

fetch("https://ecom-production-2600.up.railway.app/add-product",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name:name,
price:price,
image:"default.jpg",
category:category
})

})
.then(res=>res.text())
.then(data=>{
console.log(data);
loadProducts();

// clear inputs
document.getElementById("name").value="";
document.getElementById("price").value="";
document.getElementById("category").value="";
})

}


/* ================= LOAD ALL PRODUCTS ================= */
function loadProducts(){

fetch("https://ecom-production-2600.up.railway.app/products")

.then(res=>res.json())

.then(data=>{

let html="";

// ✅ get user once
const user = JSON.parse(localStorage.getItem("user"));

// ✅ empty state
if(data.length === 0){
html = "<h3>No products available</h3>";
}

data.forEach(product=>{

let deleteBtn = "";

// ✅ safe admin check
if(user?.role === "admin"){
deleteBtn = `<button onclick="deleteProduct(${product.id})">Delete</button>`;
}

html += `
<div class="product-card">
<img src="https://ecom-production-2600.up.railway.app/images/${product.image}" alt="product">
<h3>${product.name}</h3>
<p>₹${product.price}</p>
<button onclick="addToCart(${product.id})">Add to Cart</button>
${deleteBtn}
</div>
`;

});

document.getElementById("productList").innerHTML = html;

})

.catch(err=>{
console.log("Error loading products:", err);
});

}


/* ================= LOAD CATEGORY PRODUCTS ================= */
function loadCategory(category){

fetch("https://ecom-production-2600.up.railway.app/products")

.then(res=>res.json())

.then(data=>{

let html="";
let found = false;

// 👇 get user
const user = JSON.parse(localStorage.getItem("user"));

data.forEach(product=>{

// ✅ category match (case insensitive)
if(product.category && product.category.toLowerCase() === category.toLowerCase()){

found = true;

// 👇 admin check
let deleteBtn = "";

if(user && user.role === "admin"){
deleteBtn = `<button onclick="deleteProduct(${product.id})">Delete</button>`;
}

html += `
<div class="product-card">
<img src="https://ecom-production-2600.up.railway.app/images/${product.image}" alt="product">
<h3>${product.name}</h3>
<p>₹${product.price}</p>
<button onclick="addToCart(${product.id})">Add to Cart</button>
${deleteBtn}
</div>
`;

}

});

// ✅ empty category message
if(!found){
html = `<h3>No products found in ${category}</h3>`;
}

document.getElementById("productList").innerHTML = html;

})

}


/* ================= ADD TO CART ================= */
function addToCart(id){

const user = JSON.parse(localStorage.getItem("user"));

fetch("https://ecom-production-2600.up.railway.app/add-to-cart",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
product_id:id,
user_id:user.id
})

})
.then(res=>res.text())
.then(data=>alert(data))

}


/* ================= DELETE PRODUCT ================= */
function deleteProduct(id){

fetch("https://ecom-production-2600.up.railway.app/delete-product",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
id:id
})

})
.then(res=>res.text())
.then(data=>{
console.log(data);

// 👉 NOTE: Always reload ALL products after delete
loadProducts();
})

}


/* ================= LOGOUT ================= */
function logout(){

localStorage.removeItem("user");

alert("Logged out");

window.location.href = "login.html";

}


/* ================= INITIAL LOAD ================= */
loadProducts();

/* ================= SEARCH FUNCTION ================= */
function searchProduct(){

const keyword = document.getElementById("searchInput").value.toLowerCase();

fetch("https://ecom-production-2600.up.railway.app/products")
.then(res=>res.json())
.then(data=>{

let html="";
let found = false;

data.forEach(product=>{

if(product.name.toLowerCase().includes(keyword)){

found = true;

html += `
<div class="product-card">
<img src="https://ecom-production-2600.up.railway.app/images/${product.image}" alt="product">
<h3>${product.name}</h3>
<p>₹${product.price}</p>
<button onclick="addToCart(${product.id})">Add to Cart</button>
<button onclick="deleteProduct(${product.id})">Delete</button>
</div>
`;

}

});

if(!found){
html = `<h3 style="text-align:center; margin-top:20px;">😕 No products found</h3>`;
}

document.getElementById("productList").innerHTML = html;

})

}

/* ================= PRICE FILTER ================= */
function filterPrice(){

const value = document.getElementById("priceFilter").value;

fetch("https://ecom-production-2600.up.railway.app/products")
.then(res=>res.json())
.then(data=>{

let html="";
let found = false;

// 🧠 Convert to number
const priceLimit = Number(value);

// 🧠 If no filter → show all
if(value === ""){
loadProducts();
return;
}

data.forEach(product=>{

if(product.price <= priceLimit){

found = true;

html += `
<div class="product-card">
<img src="https://ecom-production-2600.up.railway.app/images/${product.image}">
<h3>${product.name}</h3>
<p>₹${product.price}</p>
<button onclick="addToCart(${product.id})">Add to Cart</button>
<button onclick="deleteProduct(${product.id})">Delete</button>
</div>
`;

}

});

// 🧠 No result handling
if(!found){
html = `<h3 style="text-align:center;">😕 No products found</h3>`;
}

document.getElementById("productList").innerHTML = html;

});

}
