function showToast(message, type = "info"){
const container = document.getElementById("toastContainer");
if(!container){
return;
}

const toast = document.createElement("div");
toast.className = `toast ${type}`;
toast.textContent = message;
container.appendChild(toast);

setTimeout(() => {
toast.style.opacity = "0";
toast.style.transform = "translateY(12px)";
setTimeout(() => toast.remove(), 220);
}, 2600);
}

function setButtonLoading(button, isLoading, loadingText){
if(!button){
return;
}

if(isLoading){
button.dataset.originalText = button.textContent;
button.textContent = loadingText;
button.disabled = true;
button.classList.add("is-loading");
return;
}

button.textContent = button.dataset.originalText || button.textContent;
button.disabled = false;
button.classList.remove("is-loading");
}

function getCurrentUser(){
return JSON.parse(localStorage.getItem("user"));
}

function createProductCard(product, showDelete){
let deleteBtn = "";

if(showDelete){
deleteBtn = `<button type="button" onclick="deleteProduct(${product.id}, this)">Delete</button>`;
}

return `
<div class="product-card">
<img src="images/${product.image}" alt="${product.name}">
<h3>${product.name}</h3>
<p class="price-tag"><span class="currency">Rs.</span> ${product.price}</p>
<div class="product-actions">
<button type="button" onclick="addToCart(${product.id}, this)">Add to Cart</button>
${deleteBtn}
</div>
</div>
`;
}

function renderProductList(products, emptyTitle, emptyText){
const productList = document.getElementById("productList");
const user = getCurrentUser();

if(!products.length){
productList.innerHTML = `
<div class="empty-state">
<h3>${emptyTitle}</h3>
<p>${emptyText}</p>
</div>
`;
return;
}

productList.innerHTML = products.map(product => createProductCard(product, user?.role === "admin")).join("");
}

function addProduct(button){
const name = document.getElementById("name").value;
const price = document.getElementById("price").value;
const category = document.getElementById("category").value;
button = button || document.querySelector(".add-product-card button");

setButtonLoading(button, true, "Adding...");

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
showToast(data || "Product added successfully", "success");
loadProducts();
document.getElementById("name").value = "";
document.getElementById("price").value = "";
document.getElementById("category").value = "";
})
.catch(err=>{
console.log("Error adding product:", err);
showToast("Unable to add product right now", "error");
})
.finally(()=>{
setButtonLoading(button, false);
});
}

function loadProducts(){
fetch("https://ecom-production-2600.up.railway.app/products")
.then(res=>res.json())
.then(data=>{
renderProductList(data, "No products available", "Add a new product to start building your storefront.");
})
.catch(err=>{
console.log("Error loading products:", err);
renderProductList([], "Unable to load products", "Please try again in a moment.");
});
}

function loadCategory(category){
fetch("https://ecom-production-2600.up.railway.app/products")
.then(res=>res.json())
.then(data=>{
const filtered = data.filter(product => product.category && product.category.toLowerCase() === category.toLowerCase());
renderProductList(filtered, `No products found in ${category}`, "Try another category or add a matching product.");
});
}

function addToCart(id, button){
const user = getCurrentUser();
setButtonLoading(button, true, "Adding...");

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
.then(data=>showToast(data, "success"))
.catch(err=>{
console.log("Error adding to cart:", err);
showToast("Unable to add this item to cart", "error");
})
.finally(()=>{
setButtonLoading(button, false);
});
}

function deleteProduct(id, button){
setButtonLoading(button || event?.currentTarget, true, "Deleting...");

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
showToast(data || "Product deleted", "success");
loadProducts();
})
.catch(err=>{
console.log("Error deleting product:", err);
showToast("Unable to delete product right now", "error");
})
.finally(()=>{
setButtonLoading(button || event?.currentTarget, false);
});
}

function logout(){
localStorage.removeItem("user");
showToast("Logged out", "info");
setTimeout(() => {
window.location.href = "login.html";
}, 300);
}

loadProducts();

function searchProduct(){
const keyword = document.getElementById("searchInput").value.toLowerCase();

fetch("https://ecom-production-2600.up.railway.app/products")
.then(res=>res.json())
.then(data=>{
const filtered = data.filter(product => product.name.toLowerCase().includes(keyword));
renderProductList(filtered, "No products found", "Try a different product name or browse categories instead.");
});
}

function filterPrice(){
const value = document.getElementById("priceFilter").value;

fetch("https://ecom-production-2600.up.railway.app/products")
.then(res=>res.json())
.then(data=>{
const priceLimit = Number(value);

if(value === ""){
loadProducts();
return;
}

const filtered = data.filter(product => product.price <= priceLimit);
renderProductList(filtered, "No products found", "No items match the selected price range.");
});
}
