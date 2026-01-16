import dotenv from "dotenv";
dotenv.config();

import app from './src/app.js';
import { query } from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

/**
 * Validate DB connection BEFORE starting server
 * If DB is down → app must not start
 */
const startServer = async () => {
  try {
    await query("SELECT 1");
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database");
    console.error(err.message);
    process.exit(1);
  }
};

startServer();
