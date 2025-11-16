const mysql = require("mysql2");
const pkg = require("pg");


const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,   
  },
});


module.exports = pool;
