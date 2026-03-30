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

function loadCart(){
const user = JSON.parse(localStorage.getItem("user"));
if(!user){
showToast("Please login first", "error");
window.location.href = "login.html";
return;
}

fetch(`https://ecom-production-2600.up.railway.app/cart/${user.id}`)
.then(res=>res.json())
.then(data=>{
let html = "";
let total = 0;

if(data.length === 0){
html = `
<div class="empty-state">
<h3>Your cart is empty</h3>
<p>Add products from the home page to see them here and continue to checkout.</p>
</div>
`;
document.getElementById("cartItems").innerHTML = html;
return;
}

data.forEach(item=>{
total += item.price * item.quantity;

html += `
<div class="cart-card">
<img class="cart-img" src="https://ecom-production-2600.up.railway.app/images/${item.image}" alt="${item.name}">
<div class="cart-info">
<h3>${item.name}</h3>
<p class="price-tag"><span class="currency">Rs.</span> ${item.price}</p>
<div class="qty-box">
<button type="button" onclick="updateQuantity(${item.product_id}, 'decrease', this)">-</button>
<span>${item.quantity}</span>
<button type="button" onclick="updateQuantity(${item.product_id}, 'increase', this)">+</button>
</div>
</div>
</div>
`;
});

html += `
<div class="cart-total">
<h2>Total: Rs.${total}</h2>
<button type="button" onclick="checkout(this)">Checkout</button>
</div>
`;

document.getElementById("cartItems").innerHTML = html;
})
.catch(err=>{
console.log("Error loading cart:", err);
document.getElementById("cartItems").innerHTML = `
<div class="empty-state">
<h3>Unable to load your cart</h3>
<p>Please refresh the page and try again.</p>
</div>
`;
});
}

loadCart();

function updateQuantity(product_id, action, button){
const user = JSON.parse(localStorage.getItem("user"));
setButtonLoading(button, true, "...");

fetch("https://ecom-production-2600.up.railway.app/update-cart",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
product_id:product_id,
user_id:user.id,
action:action
})
})
.then(res=>res.text())
.then(()=>{
loadCart();
})
.catch(err=>{
console.log("Error updating cart:", err);
showToast("Unable to update quantity", "error");
setButtonLoading(button, false);
});
}

function checkout(button){
const totalText = document.querySelector(".cart-total h2").innerText;
const total = totalText.replace("Total: Rs.","");
const user = JSON.parse(localStorage.getItem("user"));

if(!user){
showToast("Login required", "error");
window.location.href = "login.html";
return;
}

setButtonLoading(button, true, "Processing...");

fetch("https://ecom-production-2600.up.railway.app/checkout",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
total: total,
user_id: user.id
})
})
.then(res=>res.text())
.then(data=>{
showToast(data, "success");
loadCart();
})
.catch(err=>{
console.log("Checkout error:", err);
showToast("Unable to complete checkout", "error");
})
.finally(()=>{
setButtonLoading(button, false);
});
}

function logout(){
localStorage.removeItem("user");
showToast("Logged out successfully", "info");
setTimeout(() => {
window.location.href = "login.html";
}, 300);
}
