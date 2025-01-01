const path = require("path");
const dotenv = require("dotenv");

// Load .env from the parent directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

module.exports = function override(config, env) {
  return config;
};
