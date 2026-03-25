require("dotenv").config({ path: "./.env" });

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,   // ✅ Railway host
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("DB Connected ✅");
  }
});

module.exports = db;
console.log("ENV CHECK:", process.env.DB_USER, process.env.DB_PASSWORD);


/*const mysql = require("mysql2");

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
*/