const fs = require("fs");

const apiBase = process.env.API_BASE || "https://ipbl-backend-c9ug.onrender.com";

const content = `window.API_BASE = "${apiBase}";`;

fs.writeFileSync("config.js", content);

console.log("config.js generated successfully");