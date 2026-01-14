import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

con.connect((err) => {
  if (err) {
    console.error("Connection error:", err.message);
    return;
  }

  const query = "SELECT * FROM users";

  con.query(query, (err, results, fields) => {
    if (err) {
      console.error("Query error:", err.message);
      return;
    }

    if (results.length === 0) {
      console.log("Query returned no rows.");
    } else {
      console.log("Query results:");
      console.log(results);
    }

    con.end((err) => {
      if (err) console.error("Error closing connection:", err.message);
      else console.log("Connection closed.");
    });
  });
});
