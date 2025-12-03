const fs = require("fs");

function htmlToBase64(filePath) {
    const html = fs.readFileSync(filePath, "utf-8");
    const base64 = Buffer.from(html, "utf-8").toString("base64");
    return base64;
}

const file = process.argv[2];
if (!file) {
    console.log("Usage: node encode.js input.html");
    process.exit(1);
}

console.log("\nBase64 Output:\n");
console.log(htmlToBase64(file));
