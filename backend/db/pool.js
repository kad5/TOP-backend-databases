const { Pool } = require("pg");

module.exports = new Pool({
  host: process.env.dbHost,
  user: process.env.dbUser,
  database: process.env.dbDatabase,
  password: process.env.dbPassword,
  port: process.env.dbPort,
});
