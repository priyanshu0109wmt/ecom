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

function signup(button){
const username = document.getElementById("username").value;
const password = document.getElementById("password").value;
button = button || document.querySelector(".auth-container button");

setButtonLoading(button, true, "Creating...");

fetch("https://ecom-production-2600.up.railway.app/signup",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({username,password})
})
.then(res=>res.text())
.then(data=>{
showToast(data, "success");
setTimeout(() => {
window.location.href = "login.html";
}, 500);
})
.catch(err=>{
console.log("Signup error:", err);
showToast("Unable to sign up right now", "error");
})
.finally(()=>{
setButtonLoading(button, false);
});
}

function login(button){
const username = document.getElementById("username").value;
const password = document.getElementById("password").value;
button = button || document.querySelector(".auth-container button");

setButtonLoading(button, true, "Logging in...");

fetch("https://ecom-production-2600.up.railway.app/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({username,password})
})
.then(res=>res.json())
.then(data=>{
if(data.user){
localStorage.setItem("user", JSON.stringify(data.user));
showToast("Login Successful", "success");
setTimeout(() => {
window.location.href = "index.html";
}, 400);
}else{
showToast("Invalid Credentials", "error");
}
})
.catch(err=>{
console.log("Login error:", err);
showToast("Unable to login right now", "error");
})
.finally(()=>{
setButtonLoading(button, false);
});
}
