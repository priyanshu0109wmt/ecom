function signup(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

fetch("http://localhost:5000/signup",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({username,password})
})
.then(res=>res.text())
.then(data=>{
alert(data);
window.location.href="login.html";
})

}

function login(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

fetch("http://localhost:5000/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({username,password})
})
.then(res=>res.json())
.then(data=>{

if(data.user){

// save user in localStorage
localStorage.setItem("user", JSON.stringify(data.user));

alert("Login Successful");

// redirect to home
window.location.href="index.html";

}else{
alert("Invalid Credentials");
}

})

}