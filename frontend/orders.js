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

function loadOrders(){
const user = JSON.parse(localStorage.getItem("user"));

if(!user){
window.location.href = "login.html";
return;
}

fetch(`https://ecom-production-2600.up.railway.app/orders/${user.id}`)
.then(res=>res.json())
.then(data=>{
let html = "";

if(data.length === 0){
html = `
<div class="empty-state">
<h3>No orders yet</h3>
<p>Checkout from your cart to start seeing completed orders here.</p>
</div>
`;
document.getElementById("orders").innerHTML = html;
return;
}

data.forEach(order=>{
html += `
<div class="order-card">
<h3>Order #${order.id}</h3>
<p><b>Total:</b> Rs. ${order.total_price}</p>
<p><b>Date:</b> ${new Date(order.order_date).toLocaleString()}</p>
</div>
`;
});

document.getElementById("orders").innerHTML = html;
})
.catch(err=>{
console.log("Error loading orders:", err);
document.getElementById("orders").innerHTML = `
<div class="empty-state">
<h3>Unable to load orders</h3>
<p>Please refresh the page and try again.</p>
</div>
`;
});
}

loadOrders();

function logout(){
localStorage.removeItem("user");
showToast("Logged out", "info");
setTimeout(() => {
window.location.href = "login.html";
}, 300);
}
