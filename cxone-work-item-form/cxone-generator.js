const fs = require("fs");
const readline = require("readline");
const path = require("path");

function convertHtmlToCxoneScript(html) {
  let script = 'ASSIGN formCode=""\n';

  const lines = html.split(/\r?\n/);

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed.length) return;

    // convert " to {char(34)}
    const converted = trimmed.replace(/"/g, "{char(34)}");

    script += `formCode.append("${converted}")\n`;
  });

  return script;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter input HTML file path: ", function(inputPath) {
  rl.question("Enter output file name (default: cxoneOutput.txt): ", function(outputFileName) {
    
    const htmlFilePath = path.resolve(inputPath);
    const outputName = outputFileName.trim() || "cxoneOutput.txt";

    try {
      console.log("\nReading HTML file...");
      const htmlContent = fs.readFileSync(htmlFilePath, "utf8");

      console.log("Converting...");
      const result = convertHtmlToCxoneScript(htmlContent);

      fs.writeFileSync(outputName, result);
      console.log(`\n🎉 Done! File generated successfully: ${outputName}\n`);
    } catch (err) {
      console.log("\n❌ Error: " + err.message);
    }

    rl.close();
  });
});
