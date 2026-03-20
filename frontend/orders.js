function loadOrders(){

const user = JSON.parse(localStorage.getItem("user"));

// 🛑 safety check
if(!user){
window.location.href = "login.html";
return;
}

fetch(`http://localhost:5000/orders/${user.id}`)
.then(res=>res.json())
.then(data=>{

let html="";

// 🧠 empty state
if(data.length === 0){
html = "<h3 style='text-align:center;'>🛒 No orders yet</h3>";
document.getElementById("orders").innerHTML = html;
return;
}

data.forEach(order=>{

html += `
<div class="order-card">
<h3>Order #${order.id}</h3>
<p><b>Total:</b> ₹${order.total_price}</p>
<p><b>Date:</b> ${new Date(order.order_date).toLocaleString()}</p>
</div>
`;

});

document.getElementById("orders").innerHTML = html;

})

.catch(err=>{
console.log("Error loading orders:", err);
});

}

loadOrders();

/* ================= LOGOUT ================= */
function logout(){

localStorage.removeItem("user");

alert("Logged out");

window.location.href = "login.html";

}