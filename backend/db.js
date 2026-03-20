const mysql = require("mysql2");

const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "Pr01092005#",
database: "ecommerce"
});

db.connect((err)=>{
if(err){
console.log(err);
}
else{
console.log("MySQL Connected");
}
});

module.exports = db;