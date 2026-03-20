/* ================= LOAD CART ================= */
function loadCart(){

const user = JSON.parse(localStorage.getItem("user"));

fetch(`http://localhost:5000/cart/${user.id}`)

.then(res=>res.json())

.then(data=>{

let html="";
let total=0;

// 🧠 If cart empty
if(data.length === 0){
html = "<h3>Your cart is empty</h3>";
document.getElementById("cartItems").innerHTML = html;
return;
}

data.forEach(item=>{

total += item.price * item.quantity;

html += `
<div class="cart-card">

<img src="http://localhost:5000/images/${item.image}" class="cart-img">
<div class="cart-info">
<h3>${item.name}</h3>
<p>₹${item.price}</p>

<div class="qty-box">
<button onclick="updateQuantity(${item.product_id}, 'decrease')">-</button>
<span>${item.quantity}</span>
<button onclick="updateQuantity(${item.product_id}, 'increase')">+</button>
</div>

</div>

</div>
`;

});

// 👉 Total section
html += `
<div class="cart-total">
<h2>Total: ₹${total}</h2>
<button onclick="checkout()">Checkout</button>
</div>
`;

document.getElementById("cartItems").innerHTML = html;

})

}

loadCart();


/* ================= UPDATE QUANTITY ================= */
function updateQuantity(product_id, action){

const user = JSON.parse(localStorage.getItem("user"));

fetch("http://localhost:5000/update-cart",{

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

}


/* ================= CHECKOUT ================= */
function checkout(){

const totalText = document.querySelector(".cart-total h2").innerText;
const total = totalText.replace("Total: ₹","");

const user = JSON.parse(localStorage.getItem("user"));

// ✅ safety
if(!user){
alert("Login required");
window.location.href = "login.html";
return;
}

fetch("http://localhost:5000/checkout",{

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
alert(data);
loadCart();
})

}

/* ================= LOGOUT ================= */
function logout(){

localStorage.removeItem("user");

alert("Logged out successfully");

window.location.href = "login.html";

}