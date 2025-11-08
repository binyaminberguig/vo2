const dotenv = require("dotenv");
const path = require("path");

const envPath = process.env.NODE_ENV === "production"
  ? path.resolve(__dirname, "../.env.production")
  : path.resolve(__dirname, "../.env.development");

  console.log(envPath)

dotenv.config({ path: envPath });

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET
};
