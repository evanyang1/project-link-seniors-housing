// config/database.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres", // Change to your database dialect (e.g., 'mysql', 'sqlite', etc.)
    define: {
      freezeTableName: true, // Disable pluralization globally
    },
    logging: console.log, // Set to false to disable logging
  }
);

module.exports = sequelize;
